import { GoogleGenAI, Type, Schema } from '@google/genai';
import { NewsArticle } from './newsService';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
// Fallbacks for running from server folder or when compiled in dist folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// The user has not provided the key yet, but they will in .env. We initialize when used or check here.
let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    delete process.env.GOOGLE_API_KEY; // Force using the provided GEMINI_API_KEY instead of system environment variables
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
} catch (e) {
  console.error("Failed to initialize GoogleGenAI:", e);
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

export const generateIntelligenceReport = async (countryName: string, news: NewsArticle[]) => {
  if (!ai) {
    // If no key provided, generate dynamic mock data so the app doesn't crash completely.
    console.warn("GEMINI_API_KEY is not set. Returning fallback data.");
    return fallbackData(countryName);
  }

  const newsText = news.map(n => `- ${n.title} (${n.source})`).join('\n');
  const prompt = `You are an elite geopolitical intelligence analyst for a premium hedge fund. Analyze the following real-time news headlines for ${countryName}. Provide a structured intelligence report evaluating the risk and market impact.

Recent News:
${newsText}
`;

  try {
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
};

function fallbackData(countryName: string) {
  const score = Math.floor(Math.random() * 100);
  let riskLevel = 'Stable';
  if (score > 20) riskLevel = 'Watch';
  if (score > 40) riskLevel = 'Elevated';
  if (score > 60) riskLevel = 'High';
  if (score > 80) riskLevel = 'Critical';

  return {
    geoScore: score,
    riskLevel,
    aiSummary: `AI analysis is currently operating in fallback mode for ${countryName} due to missing API key. Please check your .env configuration.`,
    marketImpact: {
      sectors: ['Defense', 'Energy'],
      direction: score > 50 ? 'Bearish' : 'Neutral'
    },
    suggestedStocks: [
      { ticker: 'LMT', name: 'Lockheed Martin', action: 'Hold', confidence: 60, reasoning: 'Fallback evaluation.' },
      { ticker: 'NVDA', name: 'NVIDIA', action: 'Buy', confidence: 88, reasoning: 'Tech remains strong.' },
      { ticker: 'XOM', name: 'ExxonMobil', action: 'Avoid', confidence: 45, reasoning: 'Energy volatility.' }
    ]
  };
}
