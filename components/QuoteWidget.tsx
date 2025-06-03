"use client";

import { useEffect, useState } from 'react';

interface SheetData {
  quote: string;
  workout: string;
}

export default function QuoteWidget() {
  const [quote, setQuote] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch('/api/sheets', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch quote');
        const data: SheetData = await response.json();
        setQuote(data.quote);
      } catch (err) {
        setError('Failed to load quote');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, []);

  if (loading) return <div className="text-white text-right">Loading quote...</div>;
  if (error) return <div className="text-red-500 text-right">{error}</div>;
  if (!quote) return null;

  return (
    <div className="text-white mt-4 text-right">
      <div className="text-2xl italic">
        "{quote}"
      </div>
    </div>
  );
} 