import { generateIntelligenceReport } from './services/aiService';
import { fetchNewsForCountry } from './services/newsService';

(async () => {
  const news = await fetchNewsForCountry('USA');
  console.log('News fetched. Calling AI...');
  const res = await generateIntelligenceReport('USA', news);
  console.log('AI Response:', JSON.stringify(res, null, 2));
})();
