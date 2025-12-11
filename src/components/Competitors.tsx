import { useState } from 'react';
import { 
  Building2, 
  Users, 
  DollarSign, 
  MapPin, 
  Calendar,
  ChevronDown,
  ChevronUp,
  Loader2,
  Zap,
  CheckCircle,
  XCircle,
  Newspaper
} from 'lucide-react';
import type { StartupData, CompetitorDetail, Competitor } from '../types';

interface CompetitorsProps {
  data: StartupData;
  onDeepDive: () => void;
  isLoading?: boolean;
}

export function Competitors({ data, onDeepDive, isLoading }: CompetitorsProps) {
  const [expandedCompetitor, setExpandedCompetitor] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set(['direct', 'broader']));

  const hasDeepDiveData = data.competitorDetails && data.competitorDetails.length > 0;

  const toggleType = (type: string) => {
    const newTypes = new Set(selectedTypes);
    if (newTypes.has(type)) {
      if (newTypes.size > 1) newTypes.delete(type);
    } else {
      newTypes.add(type);
    }
    setSelectedTypes(newTypes);
  };

  // Render for detailed competitor data
  const renderDetailedCompetitor = (competitor: CompetitorDetail) => {
    const isExpanded = expandedCompetitor === competitor.name;
    
    return (
      <div
        key={competitor.name}
        className={`
          border rounded-xl overflow-hidden transition-all
          ${competitor.type === 'direct'
            ? 'border-red-500/20 bg-red-500/5'
            : 'border-amber-500/20 bg-amber-500/5'
          }
        `}
      >
        {/* Main Row */}
        <button
          onClick={() => setExpandedCompetitor(isExpanded ? null : competitor.name)}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold
              ${competitor.type === 'direct'
                ? 'bg-red-500/20 text-red-400'
                : 'bg-amber-500/20 text-amber-400'
              }
            `}>
              {competitor.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">{competitor.name}</h3>
                <span className={`
                  px-2 py-0.5 rounded text-xs
                  ${competitor.type === 'direct'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-amber-500/20 text-amber-400'
                  }
                `}>
                  {competitor.type === 'direct' ? 'Direct' : 'Broader'}
                </span>
              </div>
              <p className="text-sm text-white/50 mt-0.5">{competitor.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-white/40">
              {competitor.totalFunding && (
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {competitor.totalFunding}
                </span>
              )}
              {competitor.employeeCount && (
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {competitor.employeeCount}
                </span>
              )}
            </div>
            <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center
              ${competitor.type === 'direct'
                ? 'bg-red-500/10 text-red-400'
                : 'bg-amber-500/10 text-amber-400'
              }
            `}>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="px-5 pb-5 pt-0 border-t border-white/10">
            <div className="grid grid-cols-4 gap-4 mt-4">
              {competitor.founded && (
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                    <Calendar className="w-3 h-3" />
                    Founded
                  </div>
                  <p className="font-medium">{competitor.founded}</p>
                </div>
              )}
              {competitor.headquarters && (
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                    <MapPin className="w-3 h-3" />
                    Headquarters
                  </div>
                  <p className="font-medium">{competitor.headquarters}</p>
                </div>
              )}
              {competitor.employeeCount && (
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                    <Users className="w-3 h-3" />
                    Employees
                  </div>
                  <p className="font-medium">{competitor.employeeCount}</p>
                </div>
              )}
              {competitor.totalFunding && (
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                    <DollarSign className="w-3 h-3" />
                    Total Funding
                  </div>
                  <p className="font-medium">{competitor.totalFunding}</p>
                </div>
              )}
            </div>

            {/* Key Products */}
            {competitor.keyProducts && competitor.keyProducts.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm text-white/40 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Key Products
                </h4>
                <div className="flex flex-wrap gap-2">
                  {competitor.keyProducts.map((product: string) => (
                    <span key={product} className="px-3 py-1 bg-white/5 rounded-lg text-sm">
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {competitor.strengths && competitor.strengths.length > 0 && (
                <div>
                  <h4 className="text-sm text-white/40 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {competitor.strengths.map((strength: string) => (
                      <li key={strength} className="text-sm text-white/70 flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 mt-2" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {competitor.weaknesses && competitor.weaknesses.length > 0 && (
                <div>
                  <h4 className="text-sm text-white/40 mb-2 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    Weaknesses
                  </h4>
                  <ul className="space-y-1">
                    {competitor.weaknesses.map((weakness: string) => (
                      <li key={weakness} className="text-sm text-white/70 flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-rose-400 mt-2" />
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Recent News */}
            {competitor.recentNews && (
              <div className="mt-4 p-3 bg-white/5 rounded-lg">
                <h4 className="text-sm text-white/40 mb-1 flex items-center gap-2">
                  <Newspaper className="w-4 h-4" />
                  Recent News
                </h4>
                <p className="text-sm text-white/70">{competitor.recentNews}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render for basic competitor data
  const renderBasicCompetitor = (competitor: Competitor) => {
    const isExpanded = expandedCompetitor === competitor.name;
    
    return (
      <div
        key={competitor.name}
        className={`
          border rounded-xl overflow-hidden transition-all
          ${competitor.type === 'direct'
            ? 'border-red-500/20 bg-red-500/5'
            : 'border-amber-500/20 bg-amber-500/5'
          }
        `}
      >
        <button
          onClick={() => setExpandedCompetitor(isExpanded ? null : competitor.name)}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold
              ${competitor.type === 'direct'
                ? 'bg-red-500/20 text-red-400'
                : 'bg-amber-500/20 text-amber-400'
              }
            `}>
              {competitor.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">{competitor.name}</h3>
                <span className={`
                  px-2 py-0.5 rounded text-xs
                  ${competitor.type === 'direct'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-amber-500/20 text-amber-400'
                  }
                `}>
                  {competitor.type === 'direct' ? 'Direct' : 'Broader'}
                </span>
              </div>
              <p className="text-sm text-white/50 mt-0.5">{competitor.description}</p>
            </div>
          </div>
          
          <div className={`
            w-8 h-8 rounded-lg flex items-center justify-center
            ${competitor.type === 'direct'
              ? 'bg-red-500/10 text-red-400'
              : 'bg-amber-500/10 text-amber-400'
            }
          `}>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isExpanded && (
          <div className="px-5 pb-5 pt-0 border-t border-white/10">
            <p className="text-sm text-white/50 mt-4">
              Click "Deep Dive" above to get detailed information about this competitor including funding, key products, strengths, and weaknesses.
            </p>
          </div>
        )}
      </div>
    );
  };

  // Filter competitors
  const detailedCompetitors = hasDeepDiveData 
    ? data.competitorDetails!.filter(c => selectedTypes.has(c.type))
    : [];
  
  const basicCompetitors = !hasDeepDiveData
    ? data.topCompetitors.filter(c => selectedTypes.has(c.type))
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Competitive Landscape</h2>
          <p className="text-white/40">
            {hasDeepDiveData ? 'Detailed competitor analysis' : 'Key competitors identified by AI'}
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

      {/* Filters */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-white/40">Filter:</span>
        <button
          onClick={() => toggleType('direct')}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors
            ${selectedTypes.has('direct')
              ? 'bg-red-500/20 border border-red-500/30 text-red-400'
              : 'bg-white/5 border border-white/10 text-white/40'
            }
          `}
        >
          <span className="w-2 h-2 rounded-full bg-red-400" />
          Direct Competitors
        </button>
        <button
          onClick={() => toggleType('broader')}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors
            ${selectedTypes.has('broader')
              ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400'
              : 'bg-white/5 border border-white/10 text-white/40'
            }
          `}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          Broader Market
        </button>
      </div>

      {/* Competitors List */}
      <div className="space-y-4">
        {hasDeepDiveData 
          ? detailedCompetitors.map(renderDetailedCompetitor)
          : basicCompetitors.map(renderBasicCompetitor)
        }
      </div>

      {(detailedCompetitors.length === 0 && basicCompetitors.length === 0) && (
        <div className="text-center py-12 text-white/40">
          No competitors match the current filter.
        </div>
      )}
    </div>
  );
}
