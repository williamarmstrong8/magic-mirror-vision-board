"use client";
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface Event {
  title: string;
  startTime: string;
  location?: string;
}

export default function CalendarWidget() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/calendar', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError('Failed to load calendar events');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="text-white text-left">Loading events...</div>;
  if (error) return <div className="text-red-500 text-left">{error}</div>;

  return (
    <div className="text-white text-left mt-0">
      <h2 className="text-2xl font-light mb-4 border-b border-white pb-2 inline-block">Calendar</h2>
      <div className="space-y-3">
        {events.slice(0, 5).map((event, index) => (
          <div key={index} className="text-lg">
            <div className="font-medium">{event.title}</div>
            <div className="text-gray-300">
              {format(new Date(event.startTime), 'MMM d, h:mm a')}
              {event.location && (
                <span className="ml-2 text-sm">• {event.location}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 