import express from 'express';
import cors from 'cors';
import { fetchNewsForCountry } from '../server/services/newsService';
import { generateIntelligenceReport } from '../server/services/aiService';
import { TRACKED_COUNTRIES, CountryData } from '../server/types';

const app = express();
app.use(cors());
app.use(express.json());

const cache = new Map<string, { data: CountryData; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

app.get('/api/countries', (req, res) => {
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.json(TRACKED_COUNTRIES);
});

app.get('/api/country/:id', async (req, res) => {
  const countryId = (req.params.id || '').toUpperCase();
  const countryBase = TRACKED_COUNTRIES.find(c => c.id === countryId);

  if (!countryBase) {
    return res.status(404).json({ error: 'Country not tracked' });
  }

  const cached = cache.get(countryId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return res.json(cached.data);
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
    res.json(fullData);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate intelligence report' });
  }
});

export default app;
