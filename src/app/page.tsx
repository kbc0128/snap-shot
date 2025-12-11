'use client';

import { useState, useCallback } from 'react';
import { Search, Sparkles, Camera, Loader2, ExternalLink, Users, DollarSign, Building2, MapPin, Calendar, ArrowRight, Zap, Target, ChevronRight, RefreshCw, CheckCircle2, Circle, BookOpen, GitBranch, Network, X, Globe, Shield, Layers } from 'lucide-react';

interface Competitor {
  name: string;
  type: string;
  description: string;
  funding: string;
}

interface CompetitorDetail {
  name: string;
  founded: number;
  headquarters: string;
  employeeCount: string;
  totalFunding: string;
  lastRound: string;
  keyProducts: string[];
  strengths: string[];
  weaknesses: string[];
  differentiator: string;
}

interface FundingRound {
  date: string;
  type: string;
  amount: string;
  leadInvestor: string;
  participants: string[];
}

interface CompetitorFunding {
  name: string;
  totalRaised: string;
  lastRound: string;
  lastValuation: string;
}

interface TeamMember {
  name: string;
  role: string;
  background: string;
  previousRoles: { company: string; role: string }[];
  highlights: string[];
}

interface MarketMapSegment {
  name: string;
  description: string;
  companies: { name: string; isTarget: boolean; description: string }[];
}

interface ValueChainStage {
  name: string;
  description: string;
  companies: string[];
  targetPosition: boolean;
}

interface StartupData {
  name: string;
  logo: string;
  tagline: string;
  industry: string;
  sector: string;
  foundingYear: number;
  headquarters: string;
  employeeCount: string;
  totalFunding: string;
  stage: string;
  website: string;
  description: string;
  marketSegments: string[];
  topCompetitors: Competitor[];
  marketMap: {
    title: string;
    description: string;
    segments: MarketMapSegment[];
  };
  valueChain: {
    title: string;
    description: string;
    stages: ValueChainStage[];
  };
  keyInsights: string[];
  dataQuality?: string;
  validationNotes?: string[];
  competitorDetails?: CompetitorDetail[];
  fundingDetails?: {
    rounds: FundingRound[];
    totalRaised: string;
    lastValuation: string;
    keyInvestors: { name: string; type: string; otherDeals: string[] }[];
  };
  competitorFunding?: CompetitorFunding[];
  teamDetails?: TeamMember[];
  boardMembers?: { name: string; role: string; background: string }[];
}

interface Source {
  id: string;
  type: string;
  model: string;
  title: string;
  timestamp: string;
  dataPoints: string[];
}

export default function SnapshotApp() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [startupData, setStartupData] = useState<StartupData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [deepDiveLoading, setDeepDiveLoading] = useState<Record<string, boolean>>({});
  const [competitorSelections, setCompetitorSelections] = useState<Record<number, boolean>>({});

  const suggestions = ['Stripe', 'Figma', 'Notion', 'Anthropic', 'OpenAI'];

  const callClaude = async (prompt: string): Promise<string> => {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.text;
  };

  const callGemini = async (prompt: string): Promise<string | null> => {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (data.error) {
        console.error('Gemini error:', data.error);
        return null;
      }
      return data.text;
    } catch (err) {
      console.error('Gemini fetch error:', err);
      return null;
    }
  };

  const analyzeStartup = useCallback(async (startupName: string) => {
    if (!startupName?.trim()) return;
    
    setIsLoading(true);
    setLoadingStage('Analyzing...');
    setError(null);
    setStartupData(null);
    setSources([]);
    setActiveTab('overview');
    setCompetitorSelections({});
    setDeepDiveLoading({});

    const claudeSearchPrompt = `You are a startup intelligence analyst. Research "${startupName.trim()}" using web search.

CRITICAL: Search the web first. Use queries like:
- "${startupName}" company official website
- "${startupName}" Crunchbase funding
- "${startupName}" LinkedIn company
- "${startupName}" latest news

DO NOT hallucinate. Use "Unknown" for unverified data. Format: $1.2B not $1200M.

Return ONLY valid JSON:
{
  "name": "Company Name",
  "logo": "first letter",
  "tagline": "From their actual website",
  "industry": "Primary industry",
  "sector": "Specific sector",
  "foundingYear": 2020,
  "headquarters": "City, Country",
  "employeeCount": "Range or Unknown",
  "totalFunding": "$XXM or Unknown",
  "stage": "Series X or Unknown",
  "website": "https://...",
  "description": "Accurate description from search",
  "marketSegments": ["Segment 1", "Segment 2"],
  "topCompetitors": [
    {"name": "Competitor", "type": "direct", "description": "What they do", "funding": "$XXM"}
  ],
  "marketMap": {
    "title": "Market Map",
    "description": "Overview",
    "segments": [
      {"name": "Segment", "description": "Desc", "companies": [{"name": "Co", "isTarget": true, "description": "Brief"}]}
    ]
  },
  "valueChain": {
    "title": "Value Chain",
    "description": "Flow",
    "stages": [{"name": "Stage", "description": "Desc", "companies": ["Co"], "targetPosition": false}]
  },
  "keyInsights": ["Insight 1", "Insight 2"],
  "searchSources": ["source1.com", "source2.com"]
}`;

    try {
      // STEP 1: Claude searches the web
      const claudeResponse = await callClaude(claudeSearchPrompt);
      const claudeJson = claudeResponse.match(/\{[\s\S]*\}/)?.[0];
      
      if (!claudeJson) throw new Error('Could not parse Claude response');
      
      let parsedData = JSON.parse(claudeJson);
      
      // STEP 2: Gemini validates with its own web search
      setLoadingStage('Cross-referencing data...');
      
      const geminiPrompt = `You are a data validation AI with web search capabilities. Review this startup intelligence data and VERIFY it against your own web searches.

STARTUP DATA TO VALIDATE:
${JSON.stringify(parsedData, null, 2)}

TASKS:
1. Use Google Search to independently verify key facts:
   - Search for "${startupName}" to confirm company details
   - Search for "${startupName} funding" to verify funding amounts
   - Search for "${startupName} founders" to verify team info
2. Flag any data points that contradict your search results
3. Fix obvious errors (wrong funding formats like $1200M should be $1.2B, incorrect dates, etc.)
4. Add a "validationFlags" array listing any concerns or contradictions found
5. Add a "suggestedCorrections" object with field names and corrected values based on your searches
6. Rate overall "dataConfidence": "high", "medium", or "low"

Return the data with your validation additions. Return ONLY valid JSON, no markdown.`;

      let geminiValidation = null;
      const geminiResponse = await callGemini(geminiPrompt);
      
      if (geminiResponse) {
        const geminiJson = geminiResponse.match(/\{[\s\S]*\}/)?.[0];
        if (geminiJson) {
          try {
            geminiValidation = JSON.parse(geminiJson);
          } catch {
            console.log('Gemini parse error, skipping validation');
          }
        }
      }
      
      // STEP 3: Claude refines with additional web search verification
      setLoadingStage('Finalizing analysis...');
      
      const claudeRefinePrompt = `You are a startup intelligence analyst doing final quality control. Use web search to verify any disputed or uncertain data points.

ORIGINAL DATA:
${JSON.stringify(parsedData, null, 2)}

VALIDATION FEEDBACK FROM GEMINI:
${geminiValidation ? JSON.stringify(geminiValidation, null, 2) : 'No validation feedback available'}

TASKS:
1. Review the validation flags and suggested corrections
2. Use web search to verify any disputed data points - search for "${startupName}" and related queries
3. Apply corrections that you can verify are accurate
4. If data is flagged as suspicious and you cannot verify it, mark as "Unverified" or use "Unknown"
5. Ensure all funding amounts use proper format ($1.2B not $1200M)
6. Set final "dataQuality": "verified" (high confidence from multiple sources), "partial" (some gaps), or "limited" (needs verification)
7. Add "validationNotes" array summarizing what was checked, corrected, or flagged

Return the final refined JSON. Return ONLY valid JSON, no markdown.`;

      const claudeRefineResponse = await callClaude(claudeRefinePrompt);
      const refinedJson = claudeRefineResponse.match(/\{[\s\S]*\}/)?.[0];
      
      if (refinedJson) {
        try {
          parsedData = JSON.parse(refinedJson);
        } catch {
          console.log('Claude refinement parse error, using original data');
        }
      }
      
      setStartupData(parsedData);
      
      const selections: Record<number, boolean> = {};
      parsedData.topCompetitors?.forEach((c: Competitor, i: number) => {
        selections[i] = c.type === 'direct';
      });
      setCompetitorSelections(selections);
      
      setSources([
        { id: `search-${Date.now()}`, type: 'web', model: 'Web Search', title: `Research: ${startupName}`, timestamp: new Date().toISOString(), dataPoints: ['Company profile', 'Market map', 'Competitors', 'News'] }
      ]);
      
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to analyze startup. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingStage('');
    }
  }, []);

  const deepDiveCompetitors = async () => {
    if (!startupData || deepDiveLoading.competitors) return;
    setDeepDiveLoading(prev => ({ ...prev, competitors: true }));
    
    const selected = startupData.topCompetitors?.filter((_, i) => competitorSelections[i]).map(c => c.name) || [];

    const prompt = `Search the web for detailed information about: ${selected.join(', ')}
Use "Unknown" for unverified data. Format billions as $1.2B.

Return ONLY valid JSON:
{"competitorDetails": [{"name": "Name", "founded": 2018, "headquarters": "City", "employeeCount": "100-500", "totalFunding": "$50M", "lastRound": "Series B", "keyProducts": ["Product"], "strengths": ["Strength"], "weaknesses": ["Weakness"], "differentiator": "Unique value"}]}`;

    try {
      const text = await callClaude(prompt);
      const json = text.match(/\{[\s\S]*\}/)?.[0];
      if (json) {
        const parsed = JSON.parse(json);
        setStartupData(prev => prev ? { ...prev, ...parsed } : null);
        setSources(prev => [...prev, { id: `comp-${Date.now()}`, type: 'web', model: 'Web Search', title: 'Competitor research', timestamp: new Date().toISOString(), dataPoints: selected }]);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setDeepDiveLoading(prev => ({ ...prev, competitors: false }));
    }
  };

  const deepDiveFunding = async () => {
    if (!startupData || deepDiveLoading.funding) return;
    setDeepDiveLoading(prev => ({ ...prev, funding: true }));

    const prompt = `Search the web for funding details about ${startupData.name}.
Format: $1.2B not $1200M. Use "Unknown" for unverified data.

Return ONLY valid JSON:
{"fundingDetails": {"rounds": [{"date": "Month Year", "type": "Series X", "amount": "$XXM", "leadInvestor": "Name", "participants": ["Inv"]}], "totalRaised": "$XXM", "lastValuation": "$X.XB", "keyInvestors": [{"name": "Name", "type": "VC", "otherDeals": ["Co"]}]}, "competitorFunding": [{"name": "Competitor", "totalRaised": "$XXM", "lastRound": "Series X", "lastValuation": "$X.XB"}]}`;

    try {
      const text = await callClaude(prompt);
      const json = text.match(/\{[\s\S]*\}/)?.[0];
      if (json) {
        setStartupData(prev => prev ? { ...prev, ...JSON.parse(json) } : null);
        setSources(prev => [...prev, { id: `fund-${Date.now()}`, type: 'web', model: 'Web Search', title: 'Funding research', timestamp: new Date().toISOString(), dataPoints: ['Rounds', 'Investors', 'Valuations'] }]);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setDeepDiveLoading(prev => ({ ...prev, funding: false }));
    }
  };

  const deepDiveTeam = async () => {
    if (!startupData || deepDiveLoading.team) return;
    setDeepDiveLoading(prev => ({ ...prev, team: true }));

    const prompt = `Search the web for executive team at ${startupData.name}.

Return ONLY valid JSON:
{"teamDetails": [{"name": "Name", "role": "CEO", "background": "Brief bio", "previousRoles": [{"company": "Co", "role": "Title"}], "highlights": ["Achievement"]}], "boardMembers": [{"name": "Name", "role": "Board", "background": "Brief"}]}`;

    try {
      const text = await callClaude(prompt);
      const json = text.match(/\{[\s\S]*\}/)?.[0];
      if (json) {
        setStartupData(prev => prev ? { ...prev, ...JSON.parse(json) } : null);
        setSources(prev => [...prev, { id: `team-${Date.now()}`, type: 'web', model: 'Web Search', title: 'Team research', timestamp: new Date().toISOString(), dataPoints: ['Executives', 'Board'] }]);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setDeepDiveLoading(prev => ({ ...prev, team: false }));
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'market-map', label: 'Market Map', icon: Network },
    { id: 'value-chain', label: 'Value Chain', icon: GitBranch },
    { id: 'competitors', label: 'Competitors', icon: Target },
    { id: 'funding', label: 'Funding', icon: DollarSign },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'sources', label: 'Sources', icon: BookOpen },
  ];

  const qualityColors: Record<string, string> = {
    verified: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    partial: 'bg-amber-50 border-amber-200 text-amber-700',
    limited: 'bg-red-50 border-red-200 text-red-700'
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-zinc-800 antialiased">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/[0.03] rounded-full blur-[100px]" />
      </div>
      
      {/* Header */}
      <header className="relative border-b border-zinc-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-zinc-800">Snapshot</h1>
                <p className="text-xs text-zinc-500 tracking-wide">Startup Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-700">Web Search</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                <span className="text-xs font-medium text-zinc-500">Pitchbook</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-6 py-10">
        {/* Search */}
        <div className="mb-10">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-500" />
            <div className="relative flex items-center bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="pl-5 pr-3">
                <Search className="w-5 h-5 text-zinc-400" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && query.trim() && !isLoading && analyzeStartup(query)}
                placeholder="Enter a startup name to research..."
                className="flex-1 bg-transparent py-4 pr-4 text-zinc-800 placeholder:text-zinc-400 focus:outline-none text-[15px]"
              />
              <button
                onClick={() => query.trim() && !isLoading && analyzeStartup(query)}
                disabled={!query.trim() || isLoading}
                className="m-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white rounded-xl font-medium flex items-center gap-2 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Researching</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Research</>
                )}
              </button>
            </div>
          </div>

          {!isLoading && !startupData && (
            <div className="flex items-center gap-4 mt-5">
              <span className="text-xs text-zinc-500 uppercase tracking-wider">Quick start</span>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setQuery(s); analyzeStartup(s); }}
                    className="px-4 py-2 bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl text-sm text-zinc-600 hover:text-zinc-800 transition-all duration-300 shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-8 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <X className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
                <Loader2 className="w-7 h-7 text-white animate-spin" />
              </div>
              <div className="absolute -inset-4 bg-indigo-500/10 rounded-3xl blur-xl animate-pulse" />
            </div>
            <div className="text-center">
              <p className="text-zinc-700 font-medium">{loadingStage}</p>
              <p className="text-zinc-500 text-sm mt-1">This may take a moment</p>
            </div>
          </div>
        )}

        {/* Results */}
        {startupData && !isLoading && (
          <div className="space-y-8">
            {/* Data quality badge */}
            {startupData.dataQuality && (
              <div className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-xl border ${qualityColors[startupData.dataQuality] || qualityColors.partial}`}>
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium capitalize">{startupData.dataQuality} Data</span>
                {startupData.validationNotes?.[0] && (
                  <span className="text-xs opacity-70">— {startupData.validationNotes[0]}</span>
                )}
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 p-1.5 bg-zinc-100 border border-zinc-200 rounded-2xl overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2.5 whitespace-nowrap ${
                      isActive
                        ? 'bg-white text-zinc-800 shadow-sm border border-zinc-200'
                        : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="relative overflow-hidden bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/[0.03] rounded-full blur-[80px]" />
                  <div className="relative flex items-start gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 border border-indigo-200 flex items-center justify-center text-3xl font-bold text-indigo-600">
                      {startupData.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4 mb-2">
                        <h2 className="text-3xl font-bold text-zinc-800 tracking-tight">{startupData.name}</h2>
                        {startupData.website && startupData.website !== 'Unknown' && (
                          <a href={startupData.website} target="_blank" rel="noopener noreferrer" 
                             className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-700 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-zinc-600 text-lg mb-4">{startupData.tagline}</p>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
                        <span className="flex items-center gap-2"><Building2 className="w-4 h-4 text-zinc-400" /> {startupData.industry}</span>
                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-zinc-400" /> {startupData.headquarters}</span>
                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-zinc-400" /> Founded {startupData.foundingYear}</span>
                        <span className="flex items-center gap-2"><Users className="w-4 h-4 text-zinc-400" /> {startupData.employeeCount}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-4xl font-bold text-emerald-600">{startupData.totalFunding}</div>
                      <div className="text-zinc-500 mt-1">{startupData.stage}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">About</h3>
                    <p className="text-zinc-700 leading-relaxed">{startupData.description}</p>
                  </div>
                  
                  {startupData.keyInsights && (
                    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Key Insights</h3>
                      <ul className="space-y-3">
                        {startupData.keyInsights.map((insight, i) => (
                          <li key={i} className="flex items-start gap-3 text-zinc-700">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Market Segments</h3>
                  <div className="flex flex-wrap gap-2">
                    {startupData.marketSegments?.map((segment, i) => (
                      <span key={i} className="px-4 py-2 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-700 text-sm">
                        {segment}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Market Map */}
            {activeTab === 'market-map' && startupData.marketMap && (
              <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-zinc-800 mb-2">{startupData.marketMap.title}</h3>
                  <p className="text-zinc-500">{startupData.marketMap.description}</p>
                </div>
                
                <div className="space-y-4">
                  {startupData.marketMap.segments?.map((segment, i) => (
                    <div key={i} className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
                      <div className="mb-4">
                        <h4 className="font-semibold text-zinc-800 text-lg">{segment.name}</h4>
                        {segment.description && <p className="text-zinc-500 text-sm mt-1">{segment.description}</p>}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {segment.companies?.map((company, j) => (
                          <div
                            key={j}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                              company.isTarget
                                ? 'bg-indigo-100 border border-indigo-200 text-indigo-700'
                                : 'bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-800'
                            }`}
                            title={company.description}
                          >
                            {company.isTarget && <Sparkles className="w-3.5 h-3.5 inline mr-2" />}
                            {company.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Value Chain */}
            {activeTab === 'value-chain' && startupData.valueChain && (
              <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-zinc-800 mb-2">{startupData.valueChain.title}</h3>
                  <p className="text-zinc-500">{startupData.valueChain.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {startupData.valueChain.stages?.map((stage, i) => (
                    <div key={i} className="relative">
                      <div className={`h-full rounded-2xl p-5 transition-all duration-300 ${
                        stage.targetPosition
                          ? 'bg-indigo-50 border-2 border-indigo-200'
                          : 'bg-zinc-50 border border-zinc-200'
                      }`}>
                        {stage.targetPosition && (
                          <div className="absolute -top-3 left-4 px-3 py-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg text-xs font-semibold text-white shadow-lg">
                            {startupData.name}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-3 mb-3 mt-1">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                            stage.targetPosition 
                              ? 'bg-indigo-200 text-indigo-700' 
                              : 'bg-zinc-200 text-zinc-600'
                          }`}>
                            {i + 1}
                          </div>
                          <h4 className="font-medium text-zinc-800">{stage.name}</h4>
                        </div>
                        
                        <p className="text-zinc-500 text-sm mb-4">{stage.description}</p>
                        
                        <div className="space-y-1.5">
                          {stage.companies?.slice(0, 3).map((company, j) => (
                            <div key={j} className={`text-xs px-3 py-1.5 rounded-lg ${
                              company === startupData.name
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'bg-white text-zinc-600 border border-zinc-200'
                            }`}>
                              {company}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {i < (startupData.valueChain.stages?.length || 0) - 1 && (
                        <div className="hidden lg:flex absolute top-1/2 -right-2 -translate-y-1/2 z-10 w-4 h-4 items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-zinc-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Competitors */}
            {activeTab === 'competitors' && (
              <div className="space-y-6">
                {!startupData.competitorDetails ? (
                  <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-zinc-800">Select Competitors</h3>
                        <p className="text-zinc-500 text-sm mt-1">Choose competitors to research in detail</p>
                      </div>
                      <button
                        onClick={deepDiveCompetitors}
                        disabled={deepDiveLoading.competitors || !Object.values(competitorSelections).some(Boolean)}
                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white rounded-xl font-medium flex items-center gap-2 transition-all disabled:opacity-30 shadow-lg shadow-indigo-500/25"
                      >
                        {deepDiveLoading.competitors ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        Research Selected
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {startupData.topCompetitors?.map((competitor, i) => (
                        <button
                          key={i}
                          onClick={() => setCompetitorSelections(prev => ({ ...prev, [i]: !prev[i] }))}
                          className={`w-full text-left p-5 rounded-2xl transition-all duration-300 ${
                            competitorSelections[i]
                              ? 'bg-indigo-50 border-2 border-indigo-200'
                              : 'bg-zinc-50 border border-zinc-200 hover:border-zinc-300'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                              competitorSelections[i] ? 'bg-indigo-500 text-white' : 'bg-zinc-200 text-zinc-400'
                            }`}>
                              {competitorSelections[i] ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-zinc-200 flex items-center justify-center font-bold text-zinc-500 text-lg">
                              {competitor.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-zinc-800">{competitor.name}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-md ${
                                  competitor.type === 'direct' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {competitor.type}
                                </span>
                              </div>
                              <p className="text-zinc-500 text-sm truncate mt-0.5">{competitor.description}</p>
                            </div>
                            <div className="text-zinc-600 font-medium">{competitor.funding}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-zinc-800">Competitor Analysis</h3>
                      <button
                        onClick={() => setStartupData(prev => { 
                          if (!prev) return null;
                          const { competitorDetails, ...rest } = prev; 
                          return rest as StartupData; 
                        })}
                        className="text-sm text-zinc-500 hover:text-zinc-700 flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" /> Re-select
                      </button>
                    </div>
                    
                    {startupData.competitorDetails.map((c, i) => (
                      <div key={i} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-zinc-200">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-xl bg-zinc-100 flex items-center justify-center text-xl font-bold text-zinc-500">
                              {c.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xl font-bold text-zinc-800">{c.name}</h4>
                              <div className="flex gap-4 text-sm text-zinc-500 mt-1">
                                <span>{c.headquarters}</span>
                                <span>Founded {c.founded}</span>
                                <span>{c.employeeCount}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-emerald-600">{c.totalFunding}</div>
                              <div className="text-zinc-500 text-sm">{c.lastRound}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <h5 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Products</h5>
                            <div className="space-y-2">
                              {c.keyProducts?.map((p, j) => (
                                <div key={j} className="text-sm text-zinc-700 px-3 py-2 bg-zinc-100 rounded-lg">{p}</div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h5 className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-3">Strengths</h5>
                            <ul className="space-y-2">
                              {c.strengths?.map((s, j) => (
                                <li key={j} className="text-sm text-zinc-700 flex items-start gap-2">
                                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-3">Weaknesses</h5>
                            <ul className="space-y-2">
                              {c.weaknesses?.map((w, j) => (
                                <li key={j} className="text-sm text-zinc-700 flex items-start gap-2">
                                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                  {w}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200">
                          <span className="text-zinc-500 text-sm">Differentiator:</span>{' '}
                          <span className="text-zinc-700 text-sm">{c.differentiator}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Funding */}
            {activeTab === 'funding' && (
              <div className="space-y-6">
                {!startupData.fundingDetails ? (
                  <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
                      <DollarSign className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-800 mb-2">Funding Research</h3>
                    <p className="text-zinc-500 mb-6">Search for detailed funding history and investors</p>
                    <button
                      onClick={deepDiveFunding}
                      disabled={deepDiveLoading.funding}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white rounded-xl font-medium inline-flex items-center gap-2 transition-all disabled:opacity-30 shadow-lg shadow-indigo-500/25"
                    >
                      {deepDiveLoading.funding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      Research Funding
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
                      <div className="grid grid-cols-3 gap-8 text-center">
                        <div>
                          <div className="text-4xl font-bold text-emerald-600">{startupData.fundingDetails.totalRaised}</div>
                          <div className="text-zinc-500 mt-2">Total Raised</div>
                        </div>
                        <div>
                          <div className="text-4xl font-bold text-zinc-800">{startupData.fundingDetails.lastValuation}</div>
                          <div className="text-zinc-500 mt-2">Last Valuation</div>
                        </div>
                        <div>
                          <div className="text-4xl font-bold text-zinc-800">{startupData.fundingDetails.rounds?.length || 0}</div>
                          <div className="text-zinc-500 mt-2">Rounds</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                      <h3 className="font-bold text-zinc-800 mb-5">Funding Rounds</h3>
                      <div className="space-y-3">
                        {startupData.fundingDetails.rounds?.map((round, i) => (
                          <div key={i} className="flex items-center gap-5 p-4 bg-zinc-50 rounded-xl">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                              <DollarSign className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-zinc-800">{round.type}</span>
                                <span className="font-bold text-emerald-600">{round.amount}</span>
                              </div>
                              <div className="text-zinc-500 text-sm mt-0.5">{round.date} · Led by {round.leadInvestor}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {startupData.competitorFunding && (
                      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-zinc-800 mb-5">Competitor Funding</h3>
                        <div className="space-y-3">
                          {startupData.competitorFunding.map((c, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-zinc-50 rounded-xl">
                              <div className="w-10 h-10 rounded-lg bg-zinc-200 flex items-center justify-center font-bold text-zinc-500">
                                {c.name.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-zinc-700">{c.name}</div>
                                <div className="text-xs text-zinc-500">{c.lastRound}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-emerald-600">{c.totalRaised}</div>
                                <div className="text-xs text-zinc-500">{c.lastValuation}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Team */}
            {activeTab === 'team' && (
              <div className="space-y-6">
                {!startupData.teamDetails ? (
                  <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-violet-100 border border-violet-200 flex items-center justify-center mx-auto mb-5">
                      <Users className="w-8 h-8 text-violet-600" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-800 mb-2">Team Research</h3>
                    <p className="text-zinc-500 mb-6">Search for executive profiles and backgrounds</p>
                    <button
                      onClick={deepDiveTeam}
                      disabled={deepDiveLoading.team}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white rounded-xl font-medium inline-flex items-center gap-2 transition-all disabled:opacity-30 shadow-lg shadow-indigo-500/25"
                    >
                      {deepDiveLoading.team ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      Research Team
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {startupData.teamDetails.map((member, i) => (
                      <div key={i} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-4 mb-5">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center font-bold text-indigo-600 text-lg">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-bold text-zinc-800 text-lg">{member.name}</h4>
                            <div className="text-indigo-600">{member.role}</div>
                          </div>
                        </div>
                        
                        <p className="text-zinc-600 text-sm mb-5">{member.background}</p>
                        
                        {member.previousRoles && member.previousRoles.length > 0 && (
                          <div className="mb-4">
                            <h5 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Previous</h5>
                            <div className="space-y-1">
                              {member.previousRoles.slice(0, 2).map((role, j) => (
                                <div key={j} className="text-sm text-zinc-600">
                                  {role.role} at <span className="text-zinc-800">{role.company}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {member.highlights && member.highlights.length > 0 && (
                          <div>
                            <h5 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Highlights</h5>
                            <ul className="space-y-1.5">
                              {member.highlights.slice(0, 2).map((h, j) => (
                                <li key={j} className="text-sm text-zinc-600 flex items-start gap-2">
                                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                                  {h}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sources */}
            {activeTab === 'sources' && (
              <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
                <h3 className="font-bold text-zinc-800 mb-6">Data Sources</h3>
                
                {sources.length === 0 ? (
                  <p className="text-zinc-500 text-center py-8">No sources yet.</p>
                ) : (
                  <div className="space-y-4">
                    {sources.map((source) => (
                      <div key={source.id} className="p-5 bg-zinc-50 border border-zinc-200 rounded-2xl">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100">
                            <Globe className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <div className="font-medium text-zinc-800">{source.title}</div>
                            <div className="text-xs text-zinc-500">{source.model}</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {source.dataPoints?.map((dp, i) => (
                            <span key={i} className="px-3 py-1 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-600">{dp}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-6 p-5 bg-indigo-50 border border-indigo-200 rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <Layers className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-medium text-indigo-800">Pitchbook Premium</div>
                      <p className="text-zinc-600 text-sm mt-1">Connect your Pitchbook account for verified financial data, deal history, and advanced analytics</p>
                      <button className="mt-3 px-4 py-2 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-700 transition-colors shadow-sm">
                        Connect Pitchbook
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!startupData && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-100 border border-indigo-200 flex items-center justify-center">
                <Camera className="w-10 h-10 text-indigo-400" />
              </div>
              <div className="absolute -inset-8 bg-indigo-500/5 rounded-full blur-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-700 mb-3">Enter a startup to research</h2>
            <p className="text-zinc-500 max-w-md leading-relaxed">
              Get comprehensive intelligence powered by Claude web search and validated by Gemini for maximum accuracy.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
