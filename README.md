# magic-mirror-vision-board

Magic Mirror Vision Board is a custom Next.js app for physical Magic Mirror displays. It shows time, date, calendar, to-do list, weather, quote of the day, workout, and a rotating vision board. Powered by Google APIs and hosted on Vercel, it runs fullscreen on a Raspberry Pi.

## Features

- Live time and date
- Google Calendar integration
- Google Tasks integration
- Real-time weather (via public API)
- Quote of the day from Google Sheets
- Workout of the day from Google Sheets
- Rotating vision board images
- Optimized for Magic Mirror displays with two-way mirror glass
- Runs fullscreen on Raspberry Pi in kiosk mode
- Hosted on Vercel for easy updates

## Tech Stack

- Next.js (React)
- TypeScript
- NextAuth.js (Google OAuth)
- Google APIs (Calendar, Tasks, Sheets)
- Public Weather API
- Vercel (Hosting)
- Raspberry Pi (Display device)

## Deploy

The app is hosted on [Vercel](https://vercel.com/). Push updates to GitHub → auto-deploy to live Magic Mirror.

## Usage

Run locally:

```bash
npm install
npm run dev
