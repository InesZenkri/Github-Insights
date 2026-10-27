import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
// @ts-expect-error Plain-JS module shared with the Netlify function.
import { getContributionsForUser } from './shared/contributions.mjs';

// Serves the same /api/contributions endpoint as the Netlify function in
// production, so `npm run dev` works locally without the Netlify CLI.
function contributionsDevApi(): Plugin {
  return {
    name: 'contributions-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/contributions', async (req, res) => {
        const username = new URL(req.url ?? '', 'http://localhost')
          .searchParams.get('username');
        try {
          const result = await getContributionsForUser(username ?? '');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        } catch (error) {
          const status =
            error instanceof Error &&
            'status' in error &&
            typeof error.status === 'number'
              ? error.status
              : 500;
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              error:
                error instanceof Error
                  ? error.message
                  : 'Failed to fetch contribution data',
            })
          );
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), contributionsDevApi()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
