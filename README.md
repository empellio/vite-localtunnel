## @empellio/vite-localtunnel

Expose your Vite dev server to the internet via LocalTunnel. Prints the public URL and fetches the LocalTunnel password. Vite 4/5, Node 18+.

### Installation

```bash
npm install -D @empellio/vite-localtunnel
```

Peer dependency: `vite` (v4 or v5). Requires Node.js 18+ (native `fetch`).

### Quick start

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteLocalTunnel from '@empellio/vite-localtunnel'

export default defineConfig({
  plugins: [react(), viteLocalTunnel()],
})
```

When you start Vite you should see:

```
🌍 Public dev URL: https://abc-123-xyz.loca.lt
🔑 Localtunnel password: s3cr3t
```

### What it does

- Determines the dev server port from `server.httpServer.address().port` (fallback to `server.config.server.port`/`5173`).
- Starts LocalTunnel: `localtunnel({ port })` and logs `🌍 Public dev URL: …`.
- Extracts the `host` from the URL and adds it to `server.config.server.allowedHosts` (so Vite accepts requests through the tunnel).
- Fetches `https://loca.lt/mytunnelpassword` and logs `🔑 Localtunnel password: …`.
- Closes the tunnel when Vite shuts down (`tunnel.close()`).

### API Reference

- `viteLocalTunnel(): Plugin` — zero‑config, works out of the box.

### Notes

- If you already use `server.allowedHosts: true` in `vite.config.ts`, nothing to change — the plugin detects this.
- LocalTunnel is for development only. Do not use in production.

### Troubleshooting

- If the public URL or password cannot be retrieved, the plugin logs a warning. Check your network/firewall.
- Some proxies/firewalls can block `https://loca.lt`. Try another network.

### Build

Build is configured via `tsup` with ESM/CJS outputs and `index.d.ts` generation.

### Changelog

- 0.1.0: Initial release
