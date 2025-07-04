const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;


// Serve static files (index.html, app.js, etc.)
app.use(express.static(path.join(__dirname)));

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

let lastLocation = null;

// Handle WebSocket connections
wss.on('connection', function connection(ws) {
  console.log('📡 New WebSocket connection');

  // Send last known bus location to the new client
  if (lastLocation) {
    ws.send(JSON.stringify(lastLocation));
  }

  // Handle incoming GPS data
  ws.on('message', function incoming(message) {
    try {
      const data = JSON.parse(message);
      console.log('🚌 Received from ESP32:', data);
      lastLocation = data;

      // Broadcast to all connected clients (frontend viewers)
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (error) {
      console.error('❌ Invalid JSON from client:', message);
    }
  });

  ws.on('close', () => {
    console.log('❌ WebSocket client disconnected');
  });
});

// Start server
server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
