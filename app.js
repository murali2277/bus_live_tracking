// Your Supabase URL and Anon Key
const SUPABASE_URL = "https://ghxieyylfuhkoutemmog.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoeGlleXlsZnVoa291dGVtbW9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NDMzMzIsImV4cCI6MjA2NzAxOTMzMn0.CPLQ1HsBdS8xlvk-DIu8BuGoSWQImYsuMgxyH5I0MZg";

// Check login state
if (localStorage.getItem('isLoggedIn') !== 'true') {
  window.location.href = 'login.html';
}

// Fetch bus location function
async function fetchBusLocation() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/gps?select=bus_id,lat,lng,speed&order=id.desc&limit=1`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`
    }
  });
  const data = await response.json();
  return data[0]; // return first record
}

// Initialize map centered on India as default
const map = L.map('map').setView([20.5937, 78.9629], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

let marker = null;

async function updateMap() {
  try {
    const bus = await fetchBusLocation();
    if (bus && bus.lat && bus.lng) {
      const lat = bus.lat;
      const lng = bus.lng;
      const speed = bus.speed || 0;
      if (marker) {
        marker.setLatLng([lat, lng]);
        marker.setPopupContent(`🚌 Bus ID: ${bus.bus_id}`);
      } else {
        marker = L.marker([lat, lng]).addTo(map)
                 .bindPopup(`🚌 Bus ID: ${bus.bus_id}`).openPopup();
      }
      map.setView([lat, lng], 15);
      // Speed monitoring UI
      document.getElementById('bus-id').textContent = `Bus ID: ${bus.bus_id}`;
      document.getElementById('bus-speed').textContent = `Speed: ${speed} km/h`;
      document.getElementById('bus-speed').style.color = speed > 60 ? 'red' : 'green';
      console.log(`Updated location: ${lat}, ${lng}, speed: ${speed}`);
    } else {
      document.getElementById('bus-id').textContent = '';
      document.getElementById('bus-speed').textContent = '';
      console.log("No GPS data found.");
    }
  } catch (error) {
    console.error("Error fetching bus location:", error);
  }
}

// Initial call
updateMap();

// Auto refresh every 10 seconds
setInterval(updateMap, 10000);

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
  });
}

console.log("Map initialized:", map);
