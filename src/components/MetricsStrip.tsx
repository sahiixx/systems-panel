import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity, Server, Users, Zap } from 'lucide-react';

interface Metric {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: number;
}

interface MetricsStripProps {
  initialMetrics: {
    totalTasksPerDay?: number;
    totalUptime?: string;
    activeAgents?: number;
    activeModules?: number;
    tasksTrend?: number;
    uptimeTrend?: number;
    agentsTrend?: number;
  };
}

export default function MetricsStrip({ initialMetrics }: MetricsStripProps) {
  const [metrics, setMetrics] = useState(initialMetrics);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/metrics.json', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setMetrics(data);
        }
      } catch (e) {
        console.warn('Metrics update failed:', e);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const metricCards: Metric[] = [
    {
      label: 'Total Tasks/Day',
      value: metrics.totalTasksPerDay?.toLocaleString() || '—',
      icon: Activity,
      trend: metrics.tasksTrend,
    },
    {
      label: 'Aggregate Uptime',
      value: metrics.totalUptime || '—',
      icon: Server,
      trend: metrics.uptimeTrend,
    },
    {
      label: 'Active Modules',
      value: metrics.activeModules || '—',
      icon: Zap,
    },
    {
      label: 'Active Agents',
      value: metrics.activeAgents?.toLocaleString() || '—',
      icon: Users,
      trend: metrics.agentsTrend,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {metricCards.map((metric, i) => (
        <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
              <p className="text-2xl font-bold font-mono text-gray-900 dark:text-white mt-1">{metric.value}</p>
            </div>
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <metric.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
          {metric.trend !== undefined && (
            <div className="mt-2 flex items-center gap-1 text-xs">
              <span className={metric.trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                {metric.trend >= 0 ? <TrendingUp className="w-3 h-3 inline" /> : <TrendingDown className="w-3 h-3 inline" />}
                {Math.abs(metric.trend)}%
              </span>
              <span className="text-gray-500 dark:text-gray-400">vs 7d ago</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}