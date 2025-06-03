"use client";

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface Task {
  title: string;
  dueDate?: string;
  status: 'completed' | 'needsAction';
}

export default function TasksWidget() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError('Failed to load tasks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <div className="text-white">Loading tasks...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="text-white mx-auto w-[400px]">
      <h2 className="text-4xl font-light text-center mb-8 underline underline-offset-8 decoration-2">TO DO</h2>
      <ul className="space-y-6">
        {tasks.map((task, index) => (
          <li key={index} className="flex items-start space-x-4 text-2xl">
            <span className="mt-1 w-6 h-6 flex items-center justify-center">
              <span className={`block w-6 h-6 rounded-full border-2 border-white ${task.status === 'completed' ? 'bg-white' : ''}`}></span>
            </span>
            <span className={`leading-snug ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
              {task.title}
              {task.dueDate && (
                <span className="block text-lg text-gray-300">
                  Due: {format(new Date(task.dueDate), 'MMM d')}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
} 