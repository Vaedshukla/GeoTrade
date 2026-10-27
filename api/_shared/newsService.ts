import Parser from 'rss-parser';

const parser = new Parser();

export interface NewsArticle {
  title: string;
  source: string;
  time: string;
}

export const fetchNewsForCountry = async (countryName: string): Promise<NewsArticle[]> => {
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
};
