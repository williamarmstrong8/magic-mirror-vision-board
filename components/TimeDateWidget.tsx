"use client";
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function TimeDateWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-white text-left mb-6">
      <div className="text-6xl font-light mb-2">
        {format(time, 'h:mm a')}
      </div>
      <div className="text-3xl font-light">
        {format(time, 'MMMM d')}
      </div>
    </div>
  );
} 