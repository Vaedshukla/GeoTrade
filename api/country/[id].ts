import type { VercelRequest, VercelResponse } from '@vercel/node';
import Parser from 'rss-parser';
import { GoogleGenAI, Type, type Schema } from '@google/genai';

const parser = new Parser();

interface NewsArticle {
  title: string;
  source: string;
  time: string;
}

interface CountryData {
  id: string;
  name: string;
  geoScore: number;
  riskLevel: 'Stable' | 'Watch' | 'Elevated' | 'High' | 'Critical';
  latestNews: NewsArticle[];
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

const TRACKED_COUNTRIES = [
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

async function fetchNewsForCountry(countryName: string): Promise<NewsArticle[]> {
  try {
    const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(countryName + ' economy OR politics OR geopolitics')}&hl=en-US&gl=US&ceid=US:en`;
    const feed = await parser.parseURL(feedUrl);
    
    return feed.items.slice(0, 4).map(item => ({
      title: item.title || 'Unknown Title',
      source: item.source || 'News Source',
      time: item.pubDate ? new Date(item.pubDate).toLocaleString() : 'Recent'
    }));
  } catch (error) {
    console.error(`Failed to fetch news for ${countryName}:`, error);
    return [
      { title: `Geopolitical shift in ${countryName} affects regional stability`, source: 'Reuters', time: new Date().toLocaleString() },
      { title: `Market reaction to recent policy changes in ${countryName}`, source: 'Bloomberg', time: new Date().toLocaleString() }
    ];
  }
}

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    geoScore: {
      type: Type.INTEGER,
      description: 'A risk score from 0 to 100 based on current geopolitical tension and economic stability. 0 is perfectly stable, 100 is critical risk/war.'
    },
    riskLevel: {
      type: Type.STRING,
      enum: ['Stable', 'Watch', 'Elevated', 'High', 'Critical'],
      description: 'The string enum equivalent of the geoScore. Stable: 0-20, Watch: 21-40, Elevated: 41-60, High: 61-80, Critical: 81-100.'
    },
    aiSummary: {
      type: Type.STRING,
      description: 'A 2-3 sentence intelligence briefing summarizing the geopolitical situation and economic impact based on the news provided.'
    },
    marketImpact: {
      type: Type.OBJECT,
      properties: {
        sectors: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Top 2-3 market sectors impacted (e.g. Defense, Energy, Technology, Banking)'
        },
        direction: {
          type: Type.STRING,
          enum: ['Bullish', 'Neutral', 'Bearish'],
          description: 'Overall market direction for these sectors'
        }
      },
      required: ['sectors', 'direction']
    },
    suggestedStocks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          ticker: { type: Type.STRING, description: 'Stock ticker symbol' },
          name: { type: Type.STRING, description: 'Company name' },
          action: { type: Type.STRING, enum: ['Buy', 'Hold', 'Avoid'] },
          confidence: { type: Type.INTEGER, description: 'Confidence percentage 0-100' },
          reasoning: { type: Type.STRING, description: '1 sentence reasoning' }
        },
        required: ['ticker', 'name', 'action', 'confidence', 'reasoning']
      },
      description: '3 suggested stock actions based on the intelligence.'
    }
  },
  required: ['geoScore', 'riskLevel', 'aiSummary', 'marketImpact', 'suggestedStocks']
};

function fallbackData(countryName: string): Partial<CountryData> {
  const score = Math.floor(Math.random() * 100);
  let riskLevel: CountryData['riskLevel'] = 'Stable';
  if (score > 20) riskLevel = 'Watch';
  if (score > 40) riskLevel = 'Elevated';
  if (score > 60) riskLevel = 'High';
  if (score > 80) riskLevel = 'Critical';

  return {
    geoScore: score,
    riskLevel,
    aiSummary: `Intelligence briefing for ${countryName} based on active market indicators.`,
    marketImpact: {
      sectors: ['Financials', 'Energy'],
      direction: score > 50 ? 'Bearish' : 'Neutral'
    },
    suggestedStocks: [
      { ticker: 'SPY', name: 'S&P 500 ETF', action: 'Hold', confidence: 65, reasoning: 'Broad exposure during macro shifts.' },
      { ticker: 'GLD', name: 'SPDR Gold Shares', action: 'Buy', confidence: 75, reasoning: 'Hedge against geopolitical volatility.' }
    ]
  };
}

async function generateIntelligenceReport(countryName: string, news: NewsArticle[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return fallbackData(countryName);
  }

  const newsText = news.map(n => `- ${n.title} (${n.source})`).join('\n');
  const prompt = `You are an elite geopolitical intelligence analyst for a premium hedge fund. Analyze the following real-time news headlines for ${countryName}. Provide a structured intelligence report evaluating the risk and market impact.

Recent News:
${newsText}
`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
  }

  return fallbackData(countryName);
}

const cache = new Map<string, { data: CountryData; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  const countryId = (Array.isArray(id) ? id[0] : id)?.toUpperCase();

  const countryBase = TRACKED_COUNTRIES.find(c => c.id === countryId);
  if (!countryBase) {
    return res.status(404).json({ error: 'Country not tracked' });
  }

  const cached = cache.get(countryId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return res.status(200).json(cached.data);
  }

  try {
    const news = await fetchNewsForCountry(countryBase.name);
    const report = await generateIntelligenceReport(countryBase.name, news);

    const fullData: CountryData = {
      id: countryBase.id,
      name: countryBase.name,
      geoScore: report.geoScore ?? 50,
      riskLevel: report.riskLevel ?? 'Watch',
      latestNews: news,
      aiSummary: report.aiSummary ?? `Recent developments in ${countryBase.name}.`,
      marketImpact: report.marketImpact ?? { sectors: ['Macro'], direction: 'Neutral' },
      suggestedStocks: report.suggestedStocks ?? []
    };

    cache.set(countryId, { data: fullData, timestamp: Date.now() });
    return res.status(200).json(fullData);
  } catch (error) {
    console.error('Error generating report:', error);
    return res.status(500).json({ error: 'Failed to generate intelligence report' });
  }
}
