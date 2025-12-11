import { useState } from 'react';
import { Info, X } from 'lucide-react';
import type { StartupData, MarketCompany } from '../types';

interface MarketMapProps {
  data: StartupData;
}

export function MarketMap({ data }: MarketMapProps) {
  const [selectedCompany, setSelectedCompany] = useState<MarketCompany | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const colors = [
    { bg: 'from-cyan-500/20 to-cyan-600/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
    { bg: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/30', text: 'text-blue-400' },
    { bg: 'from-violet-500/20 to-violet-600/10', border: 'border-violet-500/30', text: 'text-violet-400' },
    { bg: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
    { bg: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/30', text: 'text-amber-400' },
    { bg: 'from-rose-500/20 to-rose-600/10', border: 'border-rose-500/30', text: 'text-rose-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">{data.marketMap.title}</h2>
          <p className="text-white/40">Interactive market landscape visualization</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-cyan-400 to-blue-500 ring-2 ring-cyan-400/50" />
            <span className="text-white/60">{data.name} (Target)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white/10 border border-white/20" />
            <span className="text-white/60">Other Companies</span>
          </div>
        </div>
      </div>

      {/* Market Map Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {data.marketMap.segments.map((segment, index) => {
          const colorScheme = colors[index % colors.length];
          const isHovered = hoveredSegment === segment.name;
          
          return (
            <div
              key={segment.name}
              onMouseEnter={() => setHoveredSegment(segment.name)}
              onMouseLeave={() => setHoveredSegment(null)}
              className={`
                relative p-5 rounded-2xl border transition-all duration-300
                bg-gradient-to-br ${colorScheme.bg} ${colorScheme.border}
                ${isHovered ? 'scale-[1.02] shadow-lg shadow-black/20' : ''}
              `}
            >
              {/* Segment Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${colorScheme.text}`}>{segment.name}</h3>
                <span className="text-xs text-white/30 bg-black/20 px-2 py-1 rounded-full">
                  {segment.companies.length} companies
                </span>
              </div>

              {/* Companies Grid */}
              <div className="flex flex-wrap gap-2">
                {segment.companies.map((company) => (
                  <button
                    key={company.name}
                    onClick={() => setSelectedCompany(company)}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                      ${company.isTarget
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-400/50'
                        : 'bg-black/30 text-white/70 hover:bg-black/40 hover:text-white border border-white/10'
                      }
                    `}
                  >
                    {company.name}
                  </button>
                ))}
              </div>

              {/* Hover Effect Decoration */}
              {isHovered && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>

      {/* Company Detail Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold
                  ${selectedCompany.isTarget
                    ? 'bg-gradient-to-br from-cyan-400 to-blue-500'
                    : 'bg-white/10 border border-white/20'
                  }
                `}>
                  {selectedCompany.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedCompany.name}</h3>
                  {selectedCompany.isTarget && (
                    <span className="text-xs text-cyan-400">Target Company</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedCompany(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/40" />
              </button>
            </div>
            
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-white/40 mt-0.5" />
                <p className="text-sm text-white/60">
                  {selectedCompany.isTarget
                    ? `${selectedCompany.name} is the target company for this analysis. View other tabs for detailed information.`
                    : `Click on the Competitors tab to see detailed information about ${selectedCompany.name} and how they compare.`
                  }
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedCompany(null)}
              className="w-full mt-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Legend & Info */}
      <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
        <div className="flex items-center gap-2 text-sm text-white/40">
          <Info className="w-4 h-4" />
          <span>Click on any company to see more details</span>
        </div>
        <div className="text-sm text-white/40">
          {data.marketMap.segments.reduce((acc, seg) => acc + seg.companies.length, 0)} companies mapped
        </div>
      </div>
    </div>
  );
}
