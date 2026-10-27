import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchNewsForCountry } from '../../server/services/newsService';
import { generateIntelligenceReport } from '../../server/services/aiService';
import { TRACKED_COUNTRIES, CountryData } from '../../server/types';

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
      geoScore: report.geoScore,
      riskLevel: report.riskLevel,
      latestNews: news,
      aiSummary: report.aiSummary,
      marketImpact: report.marketImpact,
      suggestedStocks: report.suggestedStocks
    };

    cache.set(countryId, { data: fullData, timestamp: Date.now() });
    return res.status(200).json(fullData);
  } catch (error) {
    console.error('Error generating report:', error);
    return res.status(500).json({ error: 'Failed to generate intelligence report' });
  }
}
