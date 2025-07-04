const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

client.on('connect', () => {
  console.log('✅ Connected to HiveMQ via WebSocket');
  client.subscribe('bus/gps', (err) => {
    if (!err) {
      console.log('📡 Subscribed to bus/gps');
    } else {
      console.error('❌ Subscription error:', err);
    }
  });
});

client.on('error', (err) => {
  console.error('❌ MQTT Connection Error:', err);
});

client.on('message', (topic, message) => {
  console.log(`[MQTT] Topic: ${topic}`);
  console.log(`[MQTT] Raw Message: ${message.toString()}`);

  try {
    const data = JSON.parse(message.toString());
    console.log(`🧭 Location: Lat ${data.lat}, Lng ${data.lng}, Bus ${data.bus_id}`);
    updateMap(data.lat, data.lng);
  } catch (e) {
    console.error('❌ JSON Parse Error:', e);
  }
});
