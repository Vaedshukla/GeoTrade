import { useState, useEffect } from 'react';
import GlobalDashboard from './components/GlobalDashboard';
import WorldMap from './components/WorldMap';
import IntelligencePanel from './components/IntelligencePanel';
import { fetchTrackedCountries, fetchCountryIntelligence } from './services/api';
import type { BaseCountry, CountryData } from './types';
import './App.css';

function App() {
  const [trackedCountries, setTrackedCountries] = useState<BaseCountry[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [selectedBaseCountry, setSelectedBaseCountry] = useState<BaseCountry | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTrackedCountries().then(setTrackedCountries).catch(console.error);
  }, []);

  const handleCountrySelect = async (baseCountry: BaseCountry) => {
    setSelectedBaseCountry(baseCountry);
    setSelectedCountry(null); // Clear previous
    setIsLoading(true);
    try {
      const data = await fetchCountryIntelligence(baseCountry.id);
      setSelectedCountry(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock global metrics to keep UI premium without spamming AI for 35 countries at once
  const globalRiskIndex = 64;
  const activeEvents = 12;
  const countriesUnderWatch = 8;

  return (
    <div className="app-container">
      <GlobalDashboard 
        globalRiskIndex={globalRiskIndex}
        activeEvents={activeEvents}
        countriesUnderWatch={countriesUnderWatch}
      />
      
      <WorldMap 
        trackedCountries={trackedCountries}
        onCountrySelect={handleCountrySelect}
        selectedCountryId={selectedBaseCountry?.id || null}
        selectedCountryRisk={selectedCountry && selectedCountry.id === selectedBaseCountry?.id ? selectedCountry.riskLevel : null}
      />

      <IntelligencePanel 
        baseCountry={selectedBaseCountry}
        country={selectedCountry} 
        isLoading={isLoading}
        onClose={() => {
          setSelectedCountry(null);
          setSelectedBaseCountry(null);
        }} 
      />
    </div>
  );
}

export default App;
