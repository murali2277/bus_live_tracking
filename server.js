const express = require('express');
const mqtt = require('mqtt');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (HTML + mqtt.js)
app.use(express.static(path.join(__dirname, 'public')));

// MQTT setup
const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');
const topic = 'bus/gps';

mqttClient.on('connect', () => {
  console.log('✅ Connected to MQTT broker');
  mqttClient.subscribe(topic, (err) => {
    if (!err) {
      console.log(`📡 Subscribed to topic: ${topic}`);
    }
  });
});

mqttClient.on('message', (topic, message) => {
  console.log(`📥 Received on ${topic}: ${message.toString()}`);
  // Optionally broadcast to frontend via WebSocket or SSE
});

// Start web server
app.listen(PORT, () => {
  console.log(`🌐 Server running at http://localhost:${PORT}`);
});
