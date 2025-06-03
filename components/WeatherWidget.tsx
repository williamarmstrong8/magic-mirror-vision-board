"use client";

import { useEffect, useState } from 'react';

interface Weather {
  temperature: number;
  condition: string;
  iconUrl: string | null;
  tempHigh?: number;
  tempLow?: number;
}

function cToF(celsius: number) {
  return Math.round((celsius * 9) / 5 + 32);
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('/api/weather', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch weather');
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError('Failed to load weather');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) return <div className="text-white text-right text-2xl">Loading weather...</div>;
  if (error) return <div className="text-red-500 text-right text-2xl">{error}</div>;
  if (!weather) return null;

  return (
    <div className="text-white text-right flex flex-col items-end text-2xl">
      <div className="flex items-center space-x-4 mb-2">
        {weather.iconUrl ? (
          <img
            src={weather.iconUrl}
            alt={weather.condition}
            className="w-15 h-15"
          />
        ) : (
          // Placeholder cloud icon (SVG)
          <svg className="w-15 h-15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 100-10 7 7 0 00-13 6z" />
          </svg>
        )}
        <span className="text-5xl font-light">{cToF(weather.temperature)}°</span>
      </div>
      <div className="text-3xl mb-1">
        H: <span className="font-medium">{weather.tempHigh !== undefined && weather.tempHigh !== null ? cToF(weather.tempHigh) : '--'}</span>  L: <span className="font-medium">{weather.tempLow !== undefined && weather.tempLow !== null ? cToF(weather.tempLow) : '--'}</span>
      </div>
      <div className="text-4xl font-light capitalize">
        {weather.condition}
      </div>
    </div>
  );
} 