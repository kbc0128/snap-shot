import { useState } from 'react';
import { SearchInput } from './components/SearchInput';
import { Overview } from './components/Overview';
import { MarketMap } from './components/MarketMap';
import { ValueChain } from './components/ValueChain';
import { Competitors } from './components/Competitors';
import { Funding } from './components/Funding';
import { Team } from './components/Team';
import { Sources } from './components/Sources';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Loader2 } from 'lucide-react';
import type { StartupData, Source } from './types';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [startupData, setStartupData] = useState<StartupData | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleSearch = async (startupName: string) => {
    setIsLoading(true);
    setStartupData(null);
    setSources([]);
    
    try {
      const data = await generateStartupData(startupName, setSources);
      setStartupData(data);
    } catch (error) {
      console.error('Error fetching startup data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeepDive = async (section: string) => {
    if (!startupData) return;
    
    setLoadingStates(prev => ({ ...prev, [section]: true }));
    
    try {
      const deepDiveData = await generateDeepDive(startupData.name, section, setSources);
      setStartupData(prev => prev ? { ...prev, ...deepDiveData } : null);
    } catch (error) {
      console.error(`Error generating deep dive for ${section}:`, error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [section]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Subtle grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      
      {/* Header */}
      <header className="relative border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">Snapshot</h1>
                <p className="text-xs text-white/40">Startup Intelligence</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-white/30">
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Claude</span>
              <span className="text-white/20">+</span>
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10 opacity-50">Gemini</span>
              <span className="text-white/20">+</span>
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10 opacity-50">Pitchbook</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <SearchInput onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 blur-xl opacity-20 animate-pulse" />
            </div>
            <div className="text-center">
              <p className="text-white/60 text-sm">Analyzing startup data...</p>
              <p className="text-white/30 text-xs mt-1">Querying AI models and gathering sources</p>
            </div>
          </div>
        )}

        {/* Results */}
        {startupData && !isLoading && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white/10 rounded-lg px-4">
                Overview
              </TabsTrigger>
              <TabsTrigger value="market-map" className="data-[state=active]:bg-white/10 rounded-lg px-4">
                Market Map
              </TabsTrigger>
              <TabsTrigger value="value-chain" className="data-[state=active]:bg-white/10 rounded-lg px-4">
                Value Chain
              </TabsTrigger>
              <TabsTrigger value="competitors" className="data-[state=active]:bg-white/10 rounded-lg px-4">
                Competitors
              </TabsTrigger>
              <TabsTrigger value="funding" className="data-[state=active]:bg-white/10 rounded-lg px-4">
                Funding
              </TabsTrigger>
              <TabsTrigger value="team" className="data-[state=active]:bg-white/10 rounded-lg px-4">
                Team
              </TabsTrigger>
              <TabsTrigger value="sources" className="data-[state=active]:bg-white/10 rounded-lg px-4">
                Sources
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Overview 
                data={startupData} 
                onDeepDive={handleDeepDive}
                loadingStates={loadingStates}
              />
            </TabsContent>
            
            <TabsContent value="market-map" className="mt-6">
              <MarketMap data={startupData} />
            </TabsContent>
            
            <TabsContent value="value-chain" className="mt-6">
              <ValueChain data={startupData} />
            </TabsContent>
            
            <TabsContent value="competitors" className="mt-6">
              <Competitors 
                data={startupData} 
                onDeepDive={() => handleDeepDive('competitors')}
                isLoading={loadingStates.competitors}
              />
            </TabsContent>
            
            <TabsContent value="funding" className="mt-6">
              <Funding 
                data={startupData}
                onDeepDive={() => handleDeepDive('funding')}
                isLoading={loadingStates.funding}
              />
            </TabsContent>
            
            <TabsContent value="team" className="mt-6">
              <Team 
                data={startupData}
                onDeepDive={() => handleDeepDive('team')}
                isLoading={loadingStates.team}
              />
            </TabsContent>
            
            <TabsContent value="sources" className="mt-6">
              <Sources sources={sources} />
            </TabsContent>
          </Tabs>
        )}

        {/* Empty State */}
        {!startupData && !isLoading && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center mb-6">
              <Camera className="w-10 h-10 text-white/20" />
            </div>
            <h2 className="text-xl font-medium text-white/60 mb-2">Enter a startup name to begin</h2>
            <p className="text-white/30 text-sm max-w-md">
              Get instant market intelligence including market maps, value chain analysis, competitor insights, and executive team backgrounds.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

// AI-powered data generation functions
async function generateStartupData(
  startupName: string, 
  setSources: React.Dispatch<React.SetStateAction<Source[]>>
): Promise<StartupData> {
  const prompt = `You are a startup intelligence analyst. Analyze the startup "${startupName}" and provide comprehensive data.

Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
  "name": "Company Name",
  "logo": "first letter of company",
  "tagline": "One sentence description",
  "industry": "Primary industry",
  "sector": "Specific sector",
  "foundingYear": 2020,
  "headquarters": "City, Country",
  "employeeCount": "50-100",
  "totalFunding": "$10M",
  "stage": "Series A",
  "description": "2-3 sentence company description",
  "marketSegments": ["segment1", "segment2", "segment3"],
  "topCompetitors": [
    {"name": "Competitor 1", "type": "direct", "description": "Brief description"},
    {"name": "Competitor 2", "type": "direct", "description": "Brief description"},
    {"name": "Competitor 3", "type": "broader", "description": "Brief description"}
  ],
  "marketMap": {
    "title": "Industry Market Map Title",
    "segments": [
      {
        "name": "Segment Name",
        "companies": [
          {"name": "Company", "isTarget": false}
        ]
      }
    ]
  },
  "valueChain": {
    "stages": [
      {
        "name": "Stage Name",
        "description": "What happens at this stage",
        "companies": ["Company1", "Company2"],
        "targetPosition": false
      }
    ]
  }
}

Be accurate and comprehensive. If you don't have specific information, make reasonable estimates based on the industry.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const textContent = data.content?.find((c: { type: string }) => c.type === 'text')?.text || '';
    
    // Parse JSON from response
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedData = JSON.parse(jsonMatch[0]);
      
      // Add source
      setSources(prev => [...prev, {
        id: `claude-${Date.now()}`,
        type: 'ai',
        model: 'Claude Sonnet 4',
        title: `Initial analysis of ${startupName}`,
        timestamp: new Date().toISOString(),
        dataPoints: ['Company overview', 'Market segments', 'Competitors', 'Market map', 'Value chain'],
      }]);
      
      return parsedData;
    }
    
    throw new Error('Could not parse response');
  } catch (error) {
    console.error('API Error:', error);
    // Return mock data as fallback
    return getMockData(startupName);
  }
}

async function generateDeepDive(
  startupName: string,
  section: string,
  setSources: React.Dispatch<React.SetStateAction<Source[]>>
): Promise<Partial<StartupData>> {
  const prompts: Record<string, string> = {
    competitors: `Analyze the competitive landscape for "${startupName}". Return ONLY valid JSON with this structure:
{
  "competitorDetails": [
    {
      "name": "Competitor Name",
      "type": "direct",
      "description": "Detailed description",
      "founded": 2018,
      "headquarters": "City, Country",
      "employeeCount": "100-500",
      "totalFunding": "$50M",
      "keyProducts": ["Product 1", "Product 2"],
      "strengths": ["Strength 1", "Strength 2"],
      "weaknesses": ["Weakness 1", "Weakness 2"],
      "recentNews": "Recent development"
    }
  ]
}`,
    funding: `Analyze the funding landscape for "${startupName}" and its competitors. Return ONLY valid JSON with this structure:
{
  "fundingDetails": {
    "rounds": [
      {
        "date": "2023-01",
        "type": "Series A",
        "amount": "$10M",
        "leadInvestor": "Investor Name",
        "investors": ["Investor 1", "Investor 2"],
        "valuation": "$50M"
      }
    ],
    "totalRaised": "$15M",
    "lastValuation": "$50M",
    "keyInvestors": ["Investor 1", "Investor 2"]
  },
  "competitorFunding": [
    {
      "name": "Competitor",
      "totalRaised": "$100M",
      "lastRound": "Series B",
      "lastRoundDate": "2023-06",
      "keyInvestors": ["Investor 1"]
    }
  ]
}`,
    team: `Analyze the executive team of "${startupName}". Return ONLY valid JSON with this structure:
{
  "teamDetails": [
    {
      "name": "Executive Name",
      "role": "CEO",
      "previousRoles": [
        {"company": "Previous Company", "role": "Previous Role", "years": "2018-2022"}
      ],
      "education": [
        {"institution": "University", "degree": "MBA", "year": 2015}
      ],
      "highlights": ["Notable achievement 1", "Board seat at X"],
      "linkedin": "https://linkedin.com/in/example"
    }
  ]
}`
  };

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompts[section] }],
      }),
    });

    const data = await response.json();
    const textContent = data.content?.find((c: { type: string }) => c.type === 'text')?.text || '';
    
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedData = JSON.parse(jsonMatch[0]);
      
      setSources(prev => [...prev, {
        id: `claude-deepdive-${Date.now()}`,
        type: 'ai',
        model: 'Claude Sonnet 4',
        title: `Deep dive: ${section} for ${startupName}`,
        timestamp: new Date().toISOString(),
        dataPoints: [`Detailed ${section} analysis`],
      }]);
      
      return parsedData;
    }
    
    throw new Error('Could not parse response');
  } catch (error) {
    console.error('Deep dive error:', error);
    return {};
  }
}

function getMockData(startupName: string): StartupData {
  return {
    name: startupName,
    logo: startupName.charAt(0).toUpperCase(),
    tagline: 'AI-powered startup intelligence platform',
    industry: 'Technology',
    sector: 'Enterprise Software',
    foundingYear: 2021,
    headquarters: 'San Francisco, CA',
    employeeCount: '50-100',
    totalFunding: '$25M',
    stage: 'Series A',
    description: `${startupName} is an innovative company in the technology sector, focused on delivering cutting-edge solutions to enterprise customers.`,
    marketSegments: ['Enterprise Software', 'AI/ML', 'Data Analytics', 'SaaS'],
    topCompetitors: [
      { name: 'Competitor A', type: 'direct', description: 'Direct competitor in the same space' },
      { name: 'Competitor B', type: 'direct', description: 'Another key player' },
      { name: 'Competitor C', type: 'broader', description: 'Adjacent market player' },
    ],
    marketMap: {
      title: `${startupName} Industry Market Map`,
      segments: [
        {
          name: 'Core Platform',
          companies: [
            { name: startupName, isTarget: true },
            { name: 'Competitor A', isTarget: false },
            { name: 'Competitor B', isTarget: false },
          ],
        },
        {
          name: 'Data & Analytics',
          companies: [
            { name: 'Analytics Co', isTarget: false },
            { name: 'Data Platform', isTarget: false },
          ],
        },
        {
          name: 'Infrastructure',
          companies: [
            { name: 'Cloud Provider', isTarget: false },
            { name: 'DevOps Tool', isTarget: false },
          ],
        },
      ],
    },
    valueChain: {
      stages: [
        {
          name: 'Data Collection',
          description: 'Gathering raw data from various sources',
          companies: ['Data Provider A', 'Data Provider B'],
          targetPosition: false,
        },
        {
          name: 'Processing & Analysis',
          description: 'Transform and analyze data',
          companies: [startupName, 'Competitor A'],
          targetPosition: true,
        },
        {
          name: 'Delivery & Integration',
          description: 'Deliver insights to end users',
          companies: ['Integration Partner', 'API Platform'],
          targetPosition: false,
        },
        {
          name: 'End User Applications',
          description: 'Final consumer-facing applications',
          companies: ['App A', 'App B'],
          targetPosition: false,
        },
      ],
    },
  };
}

export default App;
