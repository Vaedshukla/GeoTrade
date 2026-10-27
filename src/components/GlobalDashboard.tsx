import React from 'react';
import { Activity, Globe, AlertTriangle, ShieldAlert } from 'lucide-react';
import './GlobalDashboard.css';

interface DashboardProps {
  globalRiskIndex: number;
  activeEvents: number;
  countriesUnderWatch: number;
}

const GlobalDashboard: React.FC<DashboardProps> = ({ globalRiskIndex, activeEvents, countriesUnderWatch }) => {
  return (
    <div className="global-dashboard glass-panel">
      <div className="brand">
        <Globe className="brand-icon" size={28} color="#00F0FF" />
        <div>
          <h1 className="text-gradient">GeoTrade</h1>
          <p className="tagline">Global Intelligence. Market Consequences.</p>
        </div>
      </div>
      
      <div className="metrics">
        <div className="metric">
          <div className="metric-header">
            <Activity size={16} />
            <span>Global Risk Index</span>
          </div>
          <div className="metric-value" style={{ color: globalRiskIndex > 60 ? 'var(--color-status-high)' : 'var(--color-status-stable)' }}>
            {globalRiskIndex}/100
          </div>
        </div>

        <div className="metric">
          <div className="metric-header">
            <ShieldAlert size={16} />
            <span>Alert Status</span>
          </div>
          <div className="metric-value status-blink">
            ELEVATED
          </div>
        </div>

        <div className="metric">
          <div className="metric-header">
            <AlertTriangle size={16} />
            <span>Active Events</span>
          </div>
          <div className="metric-value text-gradient">
            {activeEvents}
          </div>
        </div>

        <div className="metric">
          <div className="metric-header">
            <Globe size={16} />
            <span>Watchlist</span>
          </div>
          <div className="metric-value">
            {countriesUnderWatch}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalDashboard;
