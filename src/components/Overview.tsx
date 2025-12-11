import { Building2, MapPin, Users, DollarSign, Calendar, Tag, ChevronRight, Loader2 } from 'lucide-react';
import type { StartupData } from '../types';

interface OverviewProps {
  data: StartupData;
  onDeepDive: (section: string) => void;
  loadingStates: Record<string, boolean>;
}

export function Overview({ data, onDeepDive, loadingStates }: OverviewProps) {
  const stats = [
    { icon: Calendar, label: 'Founded', value: data.foundingYear.toString() },
    { icon: MapPin, label: 'Headquarters', value: data.headquarters },
    { icon: Users, label: 'Employees', value: data.employeeCount },
    { icon: DollarSign, label: 'Total Funding', value: data.totalFunding },
    { icon: Tag, label: 'Stage', value: data.stage },
  ];

  const deepDiveSections = [
    { id: 'competitors', label: 'Competitor Deep Dive', description: 'Detailed analysis of direct competitors' },
    { id: 'funding', label: 'Funding Deep Dive', description: 'Complete funding history and investor details' },
    { id: 'team', label: 'Team Deep Dive', description: 'Executive backgrounds and career history' },
  ];

  return (
    <div className="space-y-8">
      {/* Company Header */}
      <div className="flex items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-3xl font-bold text-cyan-400">
          {data.logo}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold">{data.name}</h2>
            <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm">
              {data.industry}
            </span>
          </div>
          <p className="text-lg text-white/60 mb-3">{data.tagline}</p>
          <p className="text-white/40 max-w-2xl">{data.description}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] transition-colors"
          >
            <div className="flex items-center gap-2 text-white/40 mb-2">
              <stat.icon className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="text-lg font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Market Segments */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-white/40" />
          <h3 className="text-lg font-semibold">Market Segments</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.marketSegments.map((segment) => (
            <span
              key={segment}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70"
            >
              {segment}
            </span>
          ))}
        </div>
      </div>

      {/* Top Competitors Preview */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Top Competitors</h3>
          <div className="flex gap-3">
            <span className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              Direct
            </span>
            <span className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Broader Market
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.topCompetitors.map((competitor) => (
            <div
              key={competitor.name}
              className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/[0.07] transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-2 h-2 rounded-full ${competitor.type === 'direct' ? 'bg-red-400' : 'bg-amber-400'}`} />
                <span className="font-medium">{competitor.name}</span>
              </div>
              <p className="text-sm text-white/40">{competitor.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Deep Dive Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {deepDiveSections.map((section) => (
          <button
            key={section.id}
            onClick={() => onDeepDive(section.id)}
            disabled={loadingStates[section.id]}
            className="group p-6 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl text-left hover:border-cyan-500/30 hover:from-cyan-500/5 hover:to-blue-500/5 transition-all disabled:opacity-50"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold group-hover:text-cyan-400 transition-colors">
                {section.label}
              </h4>
              {loadingStates[section.id] ? (
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
              ) : (
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              )}
            </div>
            <p className="text-sm text-white/40">{section.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
