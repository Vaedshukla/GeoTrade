# GeoTrade 🌍📈

**GeoTrade** is a full-stack geopolitical intelligence and market impact dashboard. It tracks global events and analyzes geopolitical risk and economic developments using live news feeds and Google's Gemini generative AI model, mapping out potential stock and market sector impacts in real time.

---

## ✨ Features

- **Interactive Global Map**: Visualizes tracked countries with interactive risk heatmaps and country-specific intelligence overlays.
- **Real-Time News Aggregation**: Fetches the latest country-specific financial and geopolitical news from live RSS feeds.
- **AI-Powered Geopolitical Analysis**: Powered by Google Gemini (`@google/genai`), generating:
  - **GeoScore**: Dynamic risk score from 0 (stable) to 100 (critical risk).
  - **Risk Classification**: Stable, Watch, Elevated, High, Critical.
  - **Executive Intelligence Briefing**: Concise summary of geopolitical situation and economic impact.
  - **Sector Impact Analysis**: Directional impact (Bullish, Neutral, Bearish) on affected economic sectors.
  - **Actionable Stock Suggestions**: Targeted stock ticker recommendations with rationale and confidence scores.
- **High-Performance Architecture**: Built with React 19, TypeScript, Vite, and an Express caching proxy server.

---

## 🏗️ Tech Stack

- **Frontend**:
  - React 19
  - TypeScript
  - Vite
  - `react-simple-maps` & `d3-geo`
  - Lucide React icons
- **Backend**:
  - Node.js & Express
  - `@google/genai` (Google Gemini SDK)
  - `rss-parser`
  - TypeScript & `ts-node`

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A Google Gemini API key ([Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Vaedshukla/GeoTrade.git
   cd GeoTrade
   ```

2. **Install root & server dependencies**:
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `server` directory:
   ```bash
   cp server/.env.example server/.env
   ```
   Add your Gemini API key:
   ```env
   PORT=3001
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Running Locally

- **Development Mode** (Runs Vite frontend with proxy to backend):
  ```bash
  # Terminal 1: Backend
  cd server
  npm start

  # Terminal 2: Frontend
  npm run dev
  ```

- **Production Build & Run**:
  ```bash
  # Builds both frontend and backend
  npm run build

  # Starts the unified Express server on port 3001
  npm start
  ```
  Visit `http://localhost:3001` in your browser.

---

## 📜 License

MIT License
