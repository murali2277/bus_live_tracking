// app.js

// --- Initialize the map ---
const map = L.map('map').setView([0, 0], 2); // Default view

// --- Add OpenStreetMap tiles ---
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// --- Marker for the bus ---
let busMarker = null;

// --- Connect to WebSocket server for live updates ---
const ws = new WebSocket('ws://localhost:8080'); // Change if needed

ws.onopen = () => {
  console.log('WebSocket connected');
};

ws.onmessage = (event) => {
  // Expecting JSON: { bus_id, lat, lng }
  try {
    const data = JSON.parse(event.data);
    if (data && data.lat && data.lng) {
      // Update marker position
      if (busMarker) {
        busMarker.setLatLng([data.lat, data.lng]);
      } else {
        busMarker = L.marker([data.lat, data.lng]).addTo(map)
          .bindPopup('Bus #' + data.bus_id).openPopup();
      }
      map.setView([data.lat, data.lng], 15);
    }
  } catch (e) {
    console.error('Invalid WebSocket data:', event.data);
  }
};

ws.onerror = (err) => {
  console.error('WebSocket error:', err);
};
