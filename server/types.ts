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

// 35 tracked countries base list
export const TRACKED_COUNTRIES = [
  { name: 'United States', id: 'USA' },
  { name: 'Canada', id: 'CAN' },
  { name: 'Mexico', id: 'MEX' },
  { name: 'Brazil', id: 'BRA' },
  { name: 'United Kingdom', id: 'GBR' },
  { name: 'Germany', id: 'DEU' },
  { name: 'France', id: 'FRA' },
  { name: 'Italy', id: 'ITA' },
  { name: 'Spain', id: 'ESP' },
  { name: 'Netherlands', id: 'NLD' },
  { name: 'Poland', id: 'POL' },
  { name: 'Ukraine', id: 'UKR' },
  { name: 'Russia', id: 'RUS' },
  { name: 'Israel', id: 'ISR' },
  { name: 'Iran', id: 'IRN' },
  { name: 'Saudi Arabia', id: 'SAU' },
  { name: 'UAE', id: 'ARE' },
  { name: 'Qatar', id: 'QAT' },
  { name: 'Turkey', id: 'TUR' },
  { name: 'China', id: 'CHN' },
  { name: 'India', id: 'IND' },
  { name: 'Japan', id: 'JPN' },
  { name: 'South Korea', id: 'KOR' },
  { name: 'Taiwan', id: 'TWN' },
  { name: 'Singapore', id: 'SGP' },
  { name: 'Indonesia', id: 'IDN' },
  { name: 'Vietnam', id: 'VNM' },
  { name: 'Australia', id: 'AUS' },
  { name: 'New Zealand', id: 'NZL' },
  { name: 'South Africa', id: 'ZAF' },
  { name: 'Egypt', id: 'EGY' },
  { name: 'Nigeria', id: 'NGA' },
  { name: 'Pakistan', id: 'PAK' },
  { name: 'Thailand', id: 'THA' },
  { name: 'Malaysia', id: 'MYS' }
];
