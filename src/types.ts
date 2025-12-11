export interface StartupData {
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
  description: string;
  marketSegments: string[];
  topCompetitors: Competitor[];
  marketMap: MarketMap;
  valueChain: ValueChain;
  
  // Deep dive data (optional, populated on demand)
  competitorDetails?: CompetitorDetail[];
  fundingDetails?: FundingDetails;
  competitorFunding?: CompetitorFunding[];
  teamDetails?: TeamMember[];
}

export interface Competitor {
  name: string;
  type: 'direct' | 'broader';
  description: string;
}

export interface CompetitorDetail {
  name: string;
  type: 'direct' | 'broader';
  description: string;
  founded?: number;
  headquarters?: string;
  employeeCount?: string;
  totalFunding?: string;
  keyProducts?: string[];
  strengths?: string[];
  weaknesses?: string[];
  recentNews?: string;
}

export interface MarketMap {
  title: string;
  segments: MarketSegment[];
}

export interface MarketSegment {
  name: string;
  companies: MarketCompany[];
}

export interface MarketCompany {
  name: string;
  isTarget: boolean;
}

export interface ValueChain {
  stages: ValueChainStage[];
}

export interface ValueChainStage {
  name: string;
  description: string;
  companies: string[];
  targetPosition: boolean;
}

export interface FundingDetails {
  rounds: FundingRound[];
  totalRaised: string;
  lastValuation: string;
  keyInvestors: string[];
}

export interface FundingRound {
  date: string;
  type: string;
  amount: string;
  leadInvestor: string;
  investors: string[];
  valuation?: string;
}

export interface CompetitorFunding {
  name: string;
  totalRaised: string;
  lastRound: string;
  lastRoundDate: string;
  keyInvestors: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  previousRoles: PreviousRole[];
  education: Education[];
  highlights: string[];
  linkedin?: string;
}

export interface PreviousRole {
  company: string;
  role: string;
  years: string;
}

export interface Education {
  institution: string;
  degree: string;
  year: number;
}

export interface Source {
  id: string;
  type: 'ai' | 'web' | 'pitchbook';
  model?: string;
  url?: string;
  title: string;
  timestamp: string;
  dataPoints: string[];
}
