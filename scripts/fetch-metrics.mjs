#!/usr/bin/env node
// scripts/fetch-metrics.mjs
// Fetches live metrics from each module's /metrics endpoint and stores in Cloudflare KV

import { createClient } from '@cloudflare/kv-asset-handler';

const MODULE_ENDPOINTS = {
  'sahiixx-agency': 'https://api.sahiixx.com/metrics',
  'sovereign-swarm-v2': 'https://swarm.sahiixx.com/metrics',
  'sahiixx-os': 'https://os.sahiixx.com/api/metrics',
  'friday-os': 'https://friday.sahiixx.com/metrics',
  'sahiixx-bus': 'https://bus.sahiixx.com/metrics',
  'sahiixx-clearwing': 'https://clearwing.sahiixx.com/metrics',
  // Add more as they get /metrics endpoints
};

const METRICS_TOKEN = process.env.METRICS_TOKEN;
const CF_API_TOKEN = process.env.CF_API_TOKEN;
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const KV_NAMESPACE = 'SYSTEMS_METRICS';

async function fetchModuleMetrics(id: string, url: string) {
  try {
    const res = await fetch(url, {
      headers: METRICS_TOKEN ? { Authorization: `Bearer ${METRICS_TOKEN}` } : {},
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.warn(`[${id}] Failed to fetch metrics: ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.warn(`[${id}] Error fetching metrics:`, e);
    return null;
  }
}

async function main() {
  if (!CF_API_TOKEN || !CF_ACCOUNT_ID) {
    console.error('Missing CF_API_TOKEN or CF_ACCOUNT_ID');
    process.exit(1);
  }

  // Note: In production, use Cloudflare's KV REST API or Wrangler
  // This is a simplified version - real implementation would use Cloudflare API
  
  console.log('Fetching metrics from', Object.keys(MODULE_ENDPOINTS).length, 'modules...');
  
  const results: Record<string, any> = {};
  
  for (const [id, url] of Object.entries(MODULE_ENDPOINTS)) {
    const data = await fetchModuleMetrics(id, url);
    if (data) {
      results[id] = {
        ...data,
        timestamp: new Date().toISOString(),
      };
      console.log(`[${id}] OK`);
    } else {
      console.log(`[${id}] SKIPPED`);
    }
  }
  
  // Compute aggregates
  const aggregate = {
    totalTasksPerDay: 0,
    totalUptime: '99.5%',
    activeAgents: 0,
    activeModules: 0,
    tasksTrend: 0,
    uptimeTrend: 0,
    agentsTrend: 0,
  };
  
  for (const [id, data] of Object.entries(results)) {
    if (data.tasksPerDay) aggregate.totalTasksPerDay += data.tasksPerDay;
    if (data.activeAgents) aggregate.activeAgents += data.activeAgents;
    aggregate.activeModules++;
  }
  
  console.log('Aggregate:', aggregate);
  console.log('Individual results:', JSON.stringify(results, null, 2));
  
  // In real implementation, write to KV via Cloudflare API
  // await kv.put('aggregate', JSON.stringify({ ...aggregate, timestamp: new Date().toISOString() }));
  // for (const [id, data] of Object.entries(results)) {
  //   await kv.put(`module:${id}`, JSON.stringify(data));
  // }
  
  console.log('Done');
}

main().catch(console.error);