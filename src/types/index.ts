export interface CountryData {
  id: string;
  name: string;
  geoScore: number;
  riskLevel: 'Stable' | 'Watch' | 'Elevated' | 'High' | 'Critical';
  latestNews: { title: string; source: string; time: string }[];
  aiSummary: string;
  marketImpact: {
    sectors: string[];
    direction: 'Bullish' | 'Neutral' | 'Bearish';
  };
  suggestedStocks: {
    ticker: string;
    name: string;
    action: 'Buy' | 'Hold' | 'Avoid';
    confidence: number;
    reasoning: string;
  }[];
}

export interface BaseCountry {
  name: string;
  id: string;
}
