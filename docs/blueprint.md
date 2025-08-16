# **App Name**: HydrateAI

## Core Features:

- Water Level Display: Display current water level (in % and mL) from the NEPHRA smart water bottle.
- Timeline View: Show a scrollable list of daily drinking events with time, amount, and cumulative total, including navigation between days.
- Dashboard: Visually represent daily hydration progress with a circular progress ring and LED ring status indicator (matching the physical bottle's LED).
- Device Connection: Allow BLE device scanning, connecting, pairing and auto-reconnecting with the NEPHRA smart water bottle to read live data and write updated settings.
- Data Synchronization: Synchronize offline events to Firestore when the app reconnects to the NEPHRA smart water bottle and clears the log in the water bottle.
- Leaderboard: Enable users to view a leaderboard showcasing the top 10 users based on their percentage of daily goal completion (demo data).
- AI-Powered Hydration Recommendations: Use profile and historical data as input for a tool that computes the optimal daily hydration goal and alert intervals. Results are stored in Firestore and sent to the ESP32 on sync.

## Style Guidelines:

- Primary color: Desaturated deep orange (#CC5A2D) for alerts and highlights, mirroring the physical bottle's LED.
- Background color: Dark gray (#1A1A1A) to complement the premium aesthetic, reminiscent of NEPHRA's branding.
- Accent color: Muted orange-red (#D93A2B) for interactive elements and subtle accents.
- Headline font: 'Montserrat' (sans-serif) to match NEPHRA brand; for headings and UI elements that need emphasis.
- Body font: 'Roboto' (sans-serif) to match user specs; for main content, ensuring readability.
- Use Material Icons flat outline style for a minimalist and modern aesthetic.
- Implement smooth, subtle animations for the progress ring and LED ring indicator to enhance user engagement.