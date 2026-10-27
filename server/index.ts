import express from 'express';
import cors from 'cors';
import { fetchNewsForCountry } from './services/newsService';
import { generateIntelligenceReport } from './services/aiService';
import { TRACKED_COUNTRIES, CountryData } from './types';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Simple in-memory cache to avoid spamming the AI API and Google News
const cache = new Map<string, { data: CountryData, timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

app.get('/api/countries', (req, res) => {
  res.json(TRACKED_COUNTRIES);
});

app.get('/api/country/:id', async (req, res) => {
  const countryId = req.params.id;
  const countryBase = TRACKED_COUNTRIES.find(c => c.id === countryId);

  if (!countryBase) {
    return res.status(404).json({ error: 'Country not tracked' });
  }

  const cached = cache.get(countryId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return res.json(cached.data);
  }

  try {
    // 1. Fetch live news
    const news = await fetchNewsForCountry(countryBase.name);
    
    // 2. Generate AI intelligence
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

import path from 'path';

// Serve frontend static files
const distPath = path.join(__dirname, '../../dist');
app.use(express.static(distPath));

// Catch-all route to serve the React app
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`GeoTrade Intelligence Server running on port ${PORT}`);
});
