// --- Initialize the map ---
const map = L.map('map').setView([0, 0], 2); // Default view

// --- Add OpenStreetMap tiles ---
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// --- Marker for the bus ---
let busMarker = null;

// --- Connect to HiveMQ public broker via MQTT over WebSocket ---
const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

client.on('connect', () => {
  console.log('✅ Connected to HiveMQ via WebSocket');
  client.subscribe('bus/gps', (err) => {
    if (!err) {
      console.log('📡 Subscribed to bus/gps');
    } else {
      console.error('❌ Subscribe error:', err);
    }
  });
});

client.on('message', (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    console.log(`🧭 Location: Lat ${data.lat}, Lng ${data.lng}, Bus ${data.bus_id}`);
    updateMap(data.lat, data.lng, data.bus_id);
  } catch (e) {
    console.error('❌ Invalid JSON payload:', e);
  }
});

// --- Update the map with the latest bus location ---
function updateMap(lat, lng, bus_id) {
  if (busMarker) {
    busMarker.setLatLng([lat, lng]);
    busMarker.setPopupContent('Bus #' + bus_id);
  } else {
    busMarker = L.marker([lat, lng]).addTo(map)
      .bindPopup('Bus #' + bus_id).openPopup();
  }
  map.setView([lat, lng], 15);
}
