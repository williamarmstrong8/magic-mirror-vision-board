"use client";

import { useEffect, useState } from 'react';

interface SheetData {
  quote: string;
  workout: string;
}

export default function WorkoutWidget() {
  const [workout, setWorkout] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await fetch('/api/sheets', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch workout');
        const data: SheetData = await response.json();
        setWorkout(data.workout);
      } catch (err) {
        setError('Failed to load workout');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, []);

  if (loading) return <div className="text-white text-right text-2xl">Loading workout...</div>;
  if (error) return <div className="text-red-500 text-right text-2xl">{error}</div>;
  if (!workout) return null;

  return (
    <div className="text-white text-right">
      <h2 className="text-4xl font-light mb-4 border-b border-white pb-2 inline-block">
        Today's Workout
      </h2>
      <div className="text-2xl whitespace-pre-line">
        {workout}
      </div>
    </div>
  );
} 