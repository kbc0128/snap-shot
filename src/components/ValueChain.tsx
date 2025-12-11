import { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import type { StartupData } from '../types';

interface ValueChainProps {
  data: StartupData;
}

export function ValueChain({ data }: ValueChainProps) {
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-1">Value Chain Analysis</h2>
        <p className="text-white/40">Where {data.name} fits in the industry value chain</p>
      </div>

      {/* Horizontal Flow Chart */}
      <div className="relative overflow-x-auto pb-4">
        <div className="flex items-stretch gap-0 min-w-max">
          {data.valueChain.stages.map((stage, index) => {
            const isTarget = stage.targetPosition;
            const isExpanded = expandedStage === stage.name;
            
            return (
              <div key={stage.name} className="flex items-stretch">
                {/* Stage Card */}
                <div
                  className={`
                    relative w-64 transition-all duration-300
                    ${isTarget ? 'z-10' : 'z-0'}
                  `}
                >
                  {/* Main Card */}
                  <button
                    onClick={() => setExpandedStage(isExpanded ? null : stage.name)}
                    className={`
                      w-full p-5 rounded-2xl border transition-all text-left h-full
                      ${isTarget
                        ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                        : 'bg-white/5 border-white/10 hover:bg-white/[0.07] hover:border-white/20'
                      }
                    `}
                  >
                    {/* Stage Number */}
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mb-3
                      ${isTarget
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white'
                        : 'bg-white/10 text-white/60'
                      }
                    `}>
                      {index + 1}
                    </div>

                    {/* Stage Name */}
                    <h3 className={`font-semibold text-lg mb-2 ${isTarget ? 'text-cyan-400' : ''}`}>
                      {stage.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-white/50 mb-4">{stage.description}</p>

                    {/* Company Count & Expand Toggle */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/30">
                        {stage.companies.length} {stage.companies.length === 1 ? 'company' : 'companies'}
                      </span>
                      <div className={`
                        w-6 h-6 rounded flex items-center justify-center
                        ${isTarget ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/10 text-white/40'}
                      `}>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {/* Target Indicator */}
                    {isTarget && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                        <div className="px-3 py-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-xs font-medium text-white shadow-lg">
                          {data.name} Position
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Expanded Companies List */}
                  {isExpanded && (
                    <div className={`
                      mt-2 p-4 rounded-xl border space-y-2 animate-in slide-in-from-top-2 duration-200
                      ${isTarget
                        ? 'bg-cyan-500/5 border-cyan-500/20'
                        : 'bg-white/5 border-white/10'
                      }
                    `}>
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Companies</p>
                      {stage.companies.map((company) => {
                        const isTargetCompany = company === data.name;
                        return (
                          <div
                            key={company}
                            className={`
                              px-3 py-2 rounded-lg text-sm
                              ${isTargetCompany
                                ? 'bg-gradient-to-r from-cyan-400/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 font-medium'
                                : 'bg-white/5 text-white/70'
                              }
                            `}
                          >
                            {company}
                            {isTargetCompany && (
                              <span className="ml-2 text-xs opacity-60">(Target)</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Arrow Connector */}
                {index < data.valueChain.stages.length - 1 && (
                  <div className="flex items-center justify-center w-12 relative">
                    <div className="absolute top-1/2 -translate-y-1/2 w-full h-0.5 bg-gradient-to-r from-white/20 to-white/10" />
                    <div className={`
                      relative z-10 w-8 h-8 rounded-full flex items-center justify-center
                      ${data.valueChain.stages[index + 1].targetPosition || isTarget
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-white/10 text-white/40'
                      }
                    `}>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Flow Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
          <h4 className="font-medium mb-2">Upstream</h4>
          <p className="text-sm text-white/50">
            {data.valueChain.stages
              .slice(0, data.valueChain.stages.findIndex(s => s.targetPosition))
              .map(s => s.name)
              .join(' → ') || 'N/A'}
          </p>
        </div>
        <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
          <h4 className="font-medium mb-2">Downstream</h4>
          <p className="text-sm text-white/50">
            {data.valueChain.stages
              .slice(data.valueChain.stages.findIndex(s => s.targetPosition) + 1)
              .map(s => s.name)
              .join(' → ') || 'N/A'}
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
        <p className="text-sm text-white/70">
          <span className="text-cyan-400 font-medium">{data.name}</span> operates in the{' '}
          <span className="font-medium">
            {data.valueChain.stages.find(s => s.targetPosition)?.name || 'core'}
          </span>{' '}
          stage of the value chain, focusing on{' '}
          {data.valueChain.stages.find(s => s.targetPosition)?.description.toLowerCase() || 'key operations'}.
        </p>
      </div>
    </div>
  );
}
