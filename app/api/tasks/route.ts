import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import authOptions from '../auth/authOptions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get access token from session
    const accessToken = (session.user as any).accessToken;
    const refreshToken = (session.user as any).refreshToken;

    if (!accessToken) {
      return NextResponse.json({ error: 'No access token' }, { status: 401 });
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    // Set credentials
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    // Create Tasks API client
    const tasks = google.tasks({ version: 'v1', auth: oauth2Client });

    // First, get the primary task list
    const taskLists = await tasks.tasklists.list();
    const primaryTaskList = taskLists.data.items?.[0];

    if (!primaryTaskList?.id) {
      return NextResponse.json({ error: 'No task list found' }, { status: 404 });
    }

    // Fetch all tasks from the primary list
    const response = await tasks.tasks.list({
      tasklist: primaryTaskList.id,
      showCompleted: true, // Include completed tasks
      showHidden: false, // Don't show hidden tasks
    });

    // Transform tasks to desired format
    const taskItems = response.data.items?.map(task => ({
      title: task.title,
      dueDate: task.due || null,
      status: task.status === 'completed' ? 'completed' : 'needsAction',
      completed: task.completed || null,
    })) || [];

    return NextResponse.json(taskItems);
  } catch (error) {
    console.error('Tasks API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
} 