import topojsonClient from 'topojson-client';

async function main() {
  const response = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
  const topology = await response.json();
  // Get the countries features
  const geojson = topojsonClient.feature(topology, topology.objects.countries);
  console.log("Number of countries:", geojson.features.length);
  console.log("Sample country properties:");
  for (let i = 0; i < Math.min(15, geojson.features.length); i++) {
    console.log(geojson.features[i].properties, "ID:", geojson.features[i].id);
  }

  // Let's check if we can map the 35 countries by name or ID.
  const trackedNames = [
    'United States', 'Canada', 'Mexico', 'Brazil', 'United Kingdom', 'Germany',
    'France', 'Italy', 'Spain', 'Netherlands', 'Poland', 'Ukraine', 'Russia',
    'Israel', 'Iran', 'Saudi Arabia', 'UAE', 'Qatar', 'Turkey', 'China', 'India',
    'Japan', 'South Korea', 'Taiwan', 'Singapore', 'Indonesia', 'Vietnam',
    'Australia', 'New Zealand', 'South Africa', 'Egypt', 'Nigeria', 'Pakistan',
    'Thailand', 'Malaysia'
  ];

  const mapNames = geojson.features.map(f => f.properties.name);
  console.log("\nUnmatched tracked countries check:");
  const trackedCountries = [
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

  for (const c of trackedCountries) {
    const hasExact = mapNames.includes(c.name);
    if (!hasExact) {
      console.log(`Unmatched: Name="${c.name}", ID="${c.id}"`);
      // check if any mapName matches ID or substring
      const matches = mapNames.filter(mn => 
        mn.toLowerCase().includes(c.name.toLowerCase()) || 
        c.name.toLowerCase().includes(mn.toLowerCase())
      );
      console.log("  Suggested map names:", matches);
    }
  }
}

main().catch(console.error);
