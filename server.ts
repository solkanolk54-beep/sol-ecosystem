import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Real-Time Weather API Endpoint for Mila, Algeria (حوض بني هارون)
app.get('/api/weather', async (_req, res) => {
  try {
    const lat = 36.4503;
    const lon = 6.2644;
    const openWeatherApiKey = process.env.OPENWEATHER_API_KEY || process.env.VITE_OPENWEATHER_API_KEY;

    // 1. If OpenWeatherMap API key is provided, query OpenWeatherMap
    if (openWeatherApiKey && openWeatherApiKey.trim() !== '') {
      try {
        const owmUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ar&appid=${openWeatherApiKey.trim()}`;
        const owmResponse = await fetch(owmUrl);
        if (owmResponse.ok) {
          const owmData = await owmResponse.json();
          return res.json({
            source: 'OpenWeatherMap',
            data: owmData,
          });
        }
      } catch (owmErr) {
        console.warn('OpenWeatherMap API request failed, falling back to Open-Meteo:', owmErr);
      }
    }

    // 2. High-precision Open-Meteo endpoint (FAO-56 agrometeorological parameters for Mila)
    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,et0_fao_evapotranspiration&timezone=Africa%2FAlgiers`;
    const omResponse = await fetch(openMeteoUrl);

    if (!omResponse.ok) {
      throw new Error(`Open-Meteo returned status ${omResponse.status}`);
    }

    const omData = await omResponse.json();
    return res.json({
      source: 'Open-Meteo',
      data: omData,
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return res.status(500).json({
      error: 'Failed to fetch weather data for Mila',
      details: (error as Error).message,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 SOL Ecosystem server running on http://0.0.0.0:${PORT}`);
    console.log(`🌤️ Weather API ready at http://0.0.0.0:${PORT}/api/weather (Mila, Algeria)`);
  });
}

startServer();
