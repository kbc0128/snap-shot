import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Loader2,
  Zap,
  Building2,
  ArrowRight
} from 'lucide-react';
import type { StartupData } from '../types';

interface FundingProps {
  data: StartupData;
  onDeepDive: () => void;
  isLoading?: boolean;
}

export function Funding({ data, onDeepDive, isLoading }: FundingProps) {
  const hasDeepDiveData = data.fundingDetails && data.fundingDetails.rounds.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Funding Overview</h2>
          <p className="text-white/40">
            {hasDeepDiveData ? 'Complete funding history and investor details' : 'Summary funding information'}
          </p>
        </div>

        {!hasDeepDiveData && (
          <button
            onClick={onDeepDive}
            disabled={isLoading}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium text-sm flex items-center gap-2 hover:from-cyan-400 hover:to-blue-400 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Deep Dive
              </>
            )}
          </button>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-5 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-xl">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-medium">Total Raised</span>
          </div>
          <p className="text-3xl font-bold text-emerald-400">
            {hasDeepDiveData ? data.fundingDetails!.totalRaised : data.totalFunding}
          </p>
        </div>
        
        <div className="p-5 bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Last Valuation</span>
          </div>
          <p className="text-3xl font-bold text-blue-400">
            {hasDeepDiveData ? data.fundingDetails!.lastValuation : 'N/A'}
          </p>
        </div>
        
        <div className="p-5 bg-gradient-to-br from-violet-500/20 to-violet-600/10 border border-violet-500/30 rounded-xl">
          <div className="flex items-center gap-2 text-violet-400 mb-2">
            <Building2 className="w-5 h-5" />
            <span className="text-sm font-medium">Current Stage</span>
          </div>
          <p className="text-3xl font-bold text-violet-400">{data.stage}</p>
        </div>
      </div>

      {/* Funding Timeline */}
      {hasDeepDiveData && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6">Funding Rounds</h3>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-violet-500" />
            
            <div className="space-y-6">
              {data.fundingDetails!.rounds.map((round, index) => (
                <div key={index} className="relative flex gap-6">
                  {/* Timeline Dot */}
                  <div className="relative z-10 w-12 h-12 rounded-full bg-[#0a0a0f] border-2 border-cyan-500 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-cyan-400" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-lg">{round.type}</h4>
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-sm font-medium">
                              {round.amount}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-white/40 mt-1">
                            <Calendar className="w-4 h-4" />
                            {round.date}
                          </div>
                        </div>
                        {round.valuation && (
                          <div className="text-right">
                            <p className="text-xs text-white/40">Valuation</p>
                            <p className="font-semibold text-blue-400">{round.valuation}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-white/40">Lead:</span>
                        <span className="px-2 py-1 bg-white/10 rounded font-medium">{round.leadInvestor}</span>
                      </div>
                      
                      {round.investors.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {round.investors.map((investor) => (
                            <span key={investor} className="px-2 py-1 bg-white/5 rounded text-sm text-white/60">
                              {investor}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Key Investors */}
      {hasDeepDiveData && data.fundingDetails!.keyInvestors.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Key Investors</h3>
          <div className="flex flex-wrap gap-3">
            {data.fundingDetails!.keyInvestors.map((investor) => (
              <div
                key={investor}
                className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.07] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400/20 to-blue-500/20 flex items-center justify-center text-cyan-400 font-bold">
                  {investor.charAt(0)}
                </div>
                <span className="font-medium">{investor}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitor Funding Comparison */}
      {data.competitorFunding && data.competitorFunding.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Competitor Funding</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-white/40">
                  <th className="pb-3 font-medium">Company</th>
                  <th className="pb-3 font-medium">Total Raised</th>
                  <th className="pb-3 font-medium">Last Round</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Key Investors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {data.competitorFunding.map((competitor) => (
                  <tr key={competitor.name} className="hover:bg-white/5">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold">
                          {competitor.name.charAt(0)}
                        </div>
                        <span className="font-medium">{competitor.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-emerald-400 font-medium">{competitor.totalRaised}</td>
                    <td className="py-4">{competitor.lastRound}</td>
                    <td className="py-4 text-white/60">{competitor.lastRoundDate}</td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-1">
                        {competitor.keyInvestors.slice(0, 2).map((inv) => (
                          <span key={inv} className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/60">
                            {inv}
                          </span>
                        ))}
                        {competitor.keyInvestors.length > 2 && (
                          <span className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/40">
                            +{competitor.keyInvestors.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Deep Dive Data */}
      {!hasDeepDiveData && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Get Detailed Funding Information</h3>
          <p className="text-white/40 mb-4 max-w-md mx-auto">
            Click "Deep Dive" to unlock complete funding history, round details, investor information, and competitor funding comparisons.
          </p>
          <button
            onClick={onDeepDive}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium text-sm hover:from-cyan-400 hover:to-blue-400 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Unlock Funding Details
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
