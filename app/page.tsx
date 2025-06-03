"use client";
import { useSession, signIn } from "next-auth/react";
import TimeDateWidget from '../components/TimeDateWidget';
import CalendarWidget from '../components/CalendarWidget';
import TasksWidget from '../components/TasksWidget';
import WeatherWidget from '../components/WeatherWidget';
import QuoteWidget from '../components/QuoteWidget';
import WorkoutWidget from '../components/WorkoutWidget';
import VisionBoardWidget from '../components/VisionBoardWidget';

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-white">Loading...</div>;
  }

  if (!session) {
    signIn();
    return <div className="text-white">Redirecting to login...</div>;
  }

  return (
    <main className="min-h-screen bg-black p-8 flex flex-col justify-between">
      {/* Top Section */}
      <div className="grid grid-cols-3 gap-8 mb-12">
        {/* Top Left */}
        <div>
          <TimeDateWidget />
          <CalendarWidget />
        </div>

        {/* Top Center */}
        <div>
          <TasksWidget />
        </div>

        {/* Top Right */}
        <div>
          <WeatherWidget />
          <QuoteWidget />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-row justify-between items-end w-full">
        {/* Bottom Center */}
        <div className="flex-1 flex justify-center">
          <VisionBoardWidget />
        </div>
        {/* Bottom Right */}
        <div className="flex-1 flex justify-end pb-8 pr-8">
          <div className="scale-125">
            <WorkoutWidget />
          </div>
        </div>
        </div>
      </main>
  );
}
