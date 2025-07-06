let selectedBusId = document.getElementById('bus-selector').value;

document.getElementById('bus-selector').addEventListener('change', (e) => {
  selectedBusId = e.target.value;
  updateMap();
});

async function fetchBusLocation() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/gps?bus_id=eq.${selectedBusId}&select=bus_id,lat,lng,speed&order=id.desc&limit=1`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json"
    }
  });
  const data = await res.json();
  return data[0];
}

async function updateMap() {
  try {
    const bus = await fetchBusLocation();
    if (bus && bus.lat && bus.lng) {
      const { lat, lng, speed, bus_id } = bus;

      if (marker) {
        marker.setLatLng([lat, lng]);
        marker.setPopupContent(`🚌 Bus ID: ${bus_id}`);
      } else {
        marker = L.marker([lat, lng], { icon: busIcon })
                  .addTo(map)
                  .bindPopup(`🚌 Bus ID: ${bus_id}`)
                  .openPopup();
      }

      map.setView([lat, lng], 15);
      document.getElementById('speed-display').textContent = `Bus ${bus_id} Speed: ${speed} km/h`;
      document.getElementById('speed-display').style.color = speed > 60 ? 'red' : '#00e676';
    } else {
      document.getElementById('speed-display').textContent = "Speed: -- km/h";
    }
  } catch (err) {
    console.error("Failed to fetch location:", err);
  }
}
