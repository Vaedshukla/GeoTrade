import React from 'react';
import { X, TrendingUp, TrendingDown, Minus, Target, Newspaper, Cpu, Briefcase, Loader2 } from 'lucide-react';
import type { BaseCountry, CountryData } from '../types';
import './IntelligencePanel.css';

interface PanelProps {
  baseCountry: BaseCountry | null;
  country: CountryData | null;
  isLoading: boolean;
  onClose: () => void;
}

const IntelligencePanel: React.FC<PanelProps> = ({ baseCountry, country, isLoading, onClose }) => {
  if (!baseCountry && !country && !isLoading) return null;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Stable': return 'var(--color-status-stable)';
      case 'Watch': return 'var(--color-status-watch)';
      case 'Elevated': return 'var(--color-status-elevated)';
      case 'High': return 'var(--color-status-high)';
      case 'Critical': return 'var(--color-status-critical)';
      default: return 'var(--color-text-primary)';
    }
  };

  const displayName = country?.name || baseCountry?.name || '';
  const isOpen = !!baseCountry || !!country || isLoading;

  return (
    <div className={`intelligence-panel glass-panel ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={onClose}>
        <X size={24} />
      </button>

      <div className="panel-header">
        <h2 className="text-gradient">{displayName}</h2>
        {country && (
          <div className="risk-badge" style={{ borderColor: getRiskColor(country.riskLevel), color: getRiskColor(country.riskLevel), boxShadow: `0 0 10px ${getRiskColor(country.riskLevel)}40` }}>
            {country.riskLevel}
          </div>
        )}
      </div>

      {isLoading && (
        <div className="loading-state">
          <Loader2 className="loading-spinner" size={32} />
          <p>INITIALIZING AI ANALYSIS</p>
          <p className="loading-sub">Fetching real-time geopolitical intelligence...</p>
        </div>
      )}

      {!isLoading && country && (
        <>
          <div className="score-container">
            <div className="score-label">GeoScore</div>
            <div className="score-value" style={{ color: getRiskColor(country.riskLevel) }}>
              {country.geoScore}<span className="score-max">/100</span>
            </div>
          </div>

          <div className="panel-section">
            <div className="section-title"><Cpu size={14} /> AI Intelligence Summary</div>
            <p className="ai-summary">{country.aiSummary}</p>
          </div>

          <div className="panel-section">
            <div className="section-title"><Newspaper size={14} /> Latest Intelligence</div>
            <div className="news-list">
              {country.latestNews.map((news, idx) => (
                <div key={idx} className="news-item">
                  <div className="news-meta">
                    <span className="news-source">{news.source}</span>
                    <span className="news-time">{news.time}</span>
                  </div>
                  <div className="news-title">{news.title}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-section">
            <div className="section-title"><Briefcase size={14} /> Market Impact</div>
            <div className="market-impact">
              <div className="impact-direction">
                {country.marketImpact.direction === 'Bullish' && <TrendingUp color="var(--color-status-stable)" />}
                {country.marketImpact.direction === 'Bearish' && <TrendingDown color="var(--color-status-critical)" />}
                {country.marketImpact.direction === 'Neutral' && <Minus color="var(--color-text-secondary)" />}
                <span>{country.marketImpact.direction} Outlook</span>
              </div>
              <div className="impact-sectors">
                {country.marketImpact.sectors.map(s => <span key={s} className="sector-tag">{s}</span>)}
              </div>
            </div>
          </div>

          <div className="panel-section">
            <div className="section-title"><Target size={14} /> Recommended Action</div>
            <div className="stock-list">
              {country.suggestedStocks.map((stock) => (
                <div key={stock.ticker} className="stock-item glass-panel">
                  <div className="stock-header">
                    <span className="stock-ticker">{stock.ticker}</span>
                    <span className="stock-action" data-action={stock.action}>{stock.action}</span>
                  </div>
                  <div className="stock-name">{stock.name}</div>
                  <div className="stock-reasoning">{stock.reasoning}</div>
                  <div className="confidence-bar-container">
                    <div className="confidence-label">Confidence {stock.confidence}%</div>
                    <div className="confidence-bar">
                      <div className="confidence-fill" style={{ width: `${stock.confidence}%`, backgroundColor: stock.action === 'Buy' ? 'var(--color-status-stable)' : stock.action === 'Avoid' ? 'var(--color-status-critical)' : 'var(--color-status-elevated)' }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IntelligencePanel;
