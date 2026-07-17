import systemsJson from '../../public/systems.json';
import type { SystemsData, Module, ModuleStage, ModuleHealth } from './systems.ts';

export async function loadSystemsData(): Promise<SystemsData> {
  return systemsJson as SystemsData;
}

export function getModules(data: SystemsData): Module[] {
  return data.modules;
}

export function getModuleById(data: SystemsData, id: string): Module | undefined {
  return data.modules.find(m => m.id === id);
}

export function getSummary(data: SystemsData) {
  return data.summary;
}

export function getModulesByDomain(data: SystemsData, domain: string): Module[] {
  return data.modules.filter(m => 
    m.domain.toLowerCase().replace(/\s+/g, '-') === domain.toLowerCase().replace(/\s+/g, '-')
  );
}

export function getModulesByStage(data: SystemsData, stage: ModuleStage): Module[] {
  return data.modules.filter(m => m.stage === stage);
}

export function getCoreModules(data: SystemsData): Module[] {
  // Core modules are those with "core" tag or in live/pilot stage with key domains
  return data.modules.filter(m => 
    m.tags.includes('core') || 
    (['live', 'pilot'].includes(m.stage) && ['Runtime & Orchestration', 'Real Estate OS', 'Security & Governance'].includes(m.domain))
  );
}

export function formatMetricKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export { type SystemsData, type Module, type ModuleStage, type ModuleHealth };
export * from './systems.ts';