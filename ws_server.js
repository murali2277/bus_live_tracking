const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let lastLocation = null;

wss.on('connection', function connection(ws) {
  // Send the last known location to new clients (optional)
  if (lastLocation) {
    ws.send(JSON.stringify(lastLocation));
  }

  ws.on('message', function incoming(message) {
    // Expecting JSON: { bus_id, lat, lng }
    try {
      const data = JSON.parse(message);
      lastLocation = data;
      // Broadcast to all clients
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (e) {
      // Ignore invalid messages
    }
  });
});

console.log('WebSocket server running on ws://localhost:8080');
