const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

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

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
