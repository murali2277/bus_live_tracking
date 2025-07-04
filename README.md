# Bus Live Tracking

## Setup

1. Import `database.sql` into your MySQL server.
2. Edit `api.php` with your DB credentials.
3. Install [Ratchet](http://socketo.me/) for PHP WebSocket server:
   ```
   composer require cboden/ratchet
   ```
4. Start the WebSocket server:
   ```
   php ws_server.php
   ```
5. Deploy files to your web server (index.html, style.css, app.js, api.php).
6. ESP32: Send POST requests to `api.php` with `bus_id`, `lat`, `lng`.
7. Open `index.html` in your browser.

## Notes

- For production, use a dedicated WebSocket server (Node.js, etc.) for better performance.
- This is a simple, educational example.