import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import authOptions from '../auth/authOptions';
import { format } from 'date-fns';

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

    // Create Sheets API client
    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

    // Get today's date in YYYY-MM-DD format
    const today = format(new Date(), 'yyyy-MM-dd');

    // Fetch both sheets in parallel
    const [quotesResponse, workoutResponse] = await Promise.all([
      sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Quotes!A:B', // Date and Quote columns
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Workout!A:B', // Date and Workout columns
      }),
    ]);

    // Helper function to find today's entry
    const findTodayEntry = (rows: any[][] | null | undefined) => {
      if (!rows || rows.length < 2) return ''; // Skip header row
      const entry = rows.find(row => row[0] === today);
      return entry ? entry[1] : '';
    };

    // Get today's quote and workout
    const quote = findTodayEntry(quotesResponse.data.values);
    const workout = findTodayEntry(workoutResponse.data.values);

    return NextResponse.json({
      quote,
      workout,
    });
  } catch (error) {
    console.error('Sheets API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sheet data' },
      { status: 500 }
    );
  }
} 