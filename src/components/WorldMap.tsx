import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import type { BaseCountry } from '../types';
import './WorldMap.css';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  trackedCountries: BaseCountry[];
  onCountrySelect: (country: BaseCountry) => void;
  selectedCountryId: string | null;
  selectedCountryRisk: string | null;
}

const WorldMap: React.FC<WorldMapProps> = ({ trackedCountries, onCountrySelect, selectedCountryId, selectedCountryRisk }) => {
  const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1 });

  const handleCountryClick = (countryData: BaseCountry) => {
    onCountrySelect(countryData);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Stable': return 'var(--color-status-stable)';
      case 'Watch': return 'var(--color-status-watch)';
      case 'Elevated': return 'var(--color-status-elevated)';
      case 'High': return 'var(--color-status-high)';
      case 'Critical': return 'var(--color-status-critical)';
      default: return '#1A2333';
    }
  };

  return (
    <div className="world-map-container">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 140 }}
        width={980}
        height={600}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup 
          zoom={position.zoom} 
          center={position.coordinates as [number, number]} 
          onMoveEnd={setPosition}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                // Name match with fallbacks for United States and UAE
                const countryData = trackedCountries.find(c => {
                  if (c.name === geo.properties.name) return true;
                  if (c.id === 'USA' && geo.properties.name === 'United States of America') return true;
                  if (c.id === 'ARE' && geo.properties.name === 'United Arab Emirates') return true;
                  return false;
                });
                const isTracked = !!countryData;
                const isSelected = selectedCountryId === countryData?.id;

                let fillColor = '#0A0F18';
                let strokeColor = 'rgba(0, 240, 255, 0.1)';

                if (isTracked && countryData) {
                  // Style selected country with its actual risk color if loaded
                  const riskColor = (isSelected && selectedCountryRisk)
                    ? getRiskColor(selectedCountryRisk)
                    : 'var(--color-status-watch)';
                  
                  fillColor = isSelected ? riskColor : '#1A2333';
                  strokeColor = riskColor;
                }

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    data-country-id={countryData?.id}
                    className={isTracked ? "tracked-country" : "untracked-country"}
                    onClick={() => {
                      if (isTracked && countryData) handleCountryClick(countryData);
                    }}
                    style={{
                      default: {
                        fill: isTracked ? `${fillColor}40` : fillColor,
                        stroke: strokeColor,
                        strokeWidth: isSelected ? 1.5 : 0.5,
                        outline: 'none',
                        transition: 'all 0.3s ease',
                      },
                      hover: {
                        fill: isTracked ? `${fillColor}80` : '#111827',
                        stroke: isTracked ? fillColor : 'rgba(0, 240, 255, 0.3)',
                        strokeWidth: 1,
                        outline: 'none',
                        cursor: isTracked ? 'pointer' : 'default',
                      },
                      pressed: {
                        fill: isTracked ? fillColor : '#111827',
                        outline: 'none',
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      
      {/* Map Overlay Gradients for Jarvish UI */}
      <div className="map-overlay vignette"></div>
      <div className="map-overlay scanline"></div>
    </div>
  );
};

export default WorldMap;
