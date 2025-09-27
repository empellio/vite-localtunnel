import type { Plugin } from 'vite';
import localtunnel from 'localtunnel';
import type { AddressInfo } from 'node:net';

export default function viteLocalTunnel(): Plugin {
  return {
    name: '@empellio/vite-localtunnel',
    apply: 'serve',
    configureServer(server) {
      let tunnel: any;

      server.httpServer?.on('close', () => {
        if (tunnel) {
          try {
            tunnel.close();
          } catch {
            // ignore
          }
          tunnel = undefined;
        }
      });

      server.httpServer?.on('listening', async () => {
        try {
          const address = server.httpServer?.address() as AddressInfo | string | null;
          const port =
            typeof address === 'object' && address
              ? address.port
              : server.config.server.port ?? 5173;

          tunnel = await localtunnel({ port });
          const publicUrl: string | undefined = tunnel?.url;

          if (!publicUrl) {
            console.log('⚠️ Failed to obtain LocalTunnel URL.');
            return;
          }

          console.log(`🌍 Public dev URL: ${publicUrl}`);

          try {
            const host = new URL(publicUrl).host;
            const allowed = server.config.server.allowedHosts as true | string[] | undefined;
            if (allowed === true) {
              // all hosts are allowed, do nothing
            } else if (Array.isArray(allowed)) {
              if (!allowed.includes(host)) allowed.push(host);
            } else {
              server.config.server.allowedHosts = [host];
            }
          } catch {
            // ignore URL/host parsing issues
          }

          try {
            const res = await fetch('https://loca.lt/mytunnelpassword');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const pw = (await res.text()).trim();
            console.log(`🔑 Localtunnel password: ${pw}`);
          } catch (e: any) {
            console.log('⚠️ Failed to fetch password from loca.lt:', e?.message ?? e);
          }
        } catch (e: any) {
          console.log('⚠️ Error while starting LocalTunnel:', e?.message ?? e);
        }
      });
    },
  };
}
