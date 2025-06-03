import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch current weather data from wttr.in
    const response = await fetch(
      'https://wttr.in/San+Francisco?format=j1',
      {
        headers: {
          'User-Agent': 'Magic Mirror Vision Board',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`wttr.in API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Extract current conditions from the response
    const current = data.current_condition[0];
    const today = data.weather[0];

    // Transform the response to our desired format
    const weather = {
      temperature: parseInt(current.temp_C), // Convert to integer
      condition: current.weatherDesc[0].value,
      iconUrl: null, // wttr.in doesn't provide icons
      tempHigh: today ? parseInt(today.maxtempC) : null,
      tempLow: today ? parseInt(today.mintempC) : null,
    };

    return NextResponse.json(weather);
  } catch (error) {
    console.error('Weather API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
} 