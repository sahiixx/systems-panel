import systemsData from '../../../public/systems.json';

// This endpoint reads from Cloudflare KV (in production) or returns mock data
// For static builds, we read the static aggregate from systems.json (imported)

export const GET = async ({ url }) => {
  const searchParams = url.searchParams;
  const moduleId = searchParams.get('module');

  // In production, fetch from Cloudflare KV:
  // const kv = createClient({ namespace: 'SYSTEMS_METRICS' });
  // if (moduleId) return new Response(await kv.get(`module:${moduleId}`) || '{}');
  // return new Response(await kv.get('aggregate') || '{}');

  const systems = systemsData;

  if (moduleId) {
    const module = systems.modules.find((m) => m.id === moduleId);
    if (!module) {
      return new Response(JSON.stringify({ error: 'Module not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({
      ...module.metrics,
      timestamp: new Date().toISOString(),
    }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }

  return new Response(JSON.stringify({
    ...systems.summary.aggregateMetrics,
    timestamp: new Date().toISOString(),
  }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
};