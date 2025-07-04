const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt');  // <- EMQX

client.on('connect', () => {
  console.log('✅ Connected to EMQX via WebSocket');
  client.subscribe('bus/gps', (err) => {
    if (!err) {
      console.log('📡 Subscribed to bus/gps');
    }
  });
});

client.on('message', (topic, message) => {
  console.log(`[MQTT] Topic: ${topic}`);
  console.log(`[MQTT] Message: ${message.toString()}`);
  try {
    const data = JSON.parse(message.toString());
    updateMap(data.lat, data.lng);
  } catch (e) {
    console.error('❌ Invalid JSON payload', e);
  }
});
