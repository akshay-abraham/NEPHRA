// This directive marks this as a Client Component, allowing interactivity.
"use client";

// --- IMPORTS ---
// Core React hooks for state management and side effects.
import { useState, useEffect } from "react";
// Component for client-side navigation without full page reloads.
import Link from "next/link";
// Icons from the lucide-react library for a consistent visual style.
import { User, Trophy, Bot, Code, Terminal, Activity, Droplet, Flame, Star, ShieldCheck, Info } from "lucide-react";
// Custom UI components from our design system.
import ProfileForm from "@/components/profile/profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
// Mock data for achievements and leaderboard. In a real app, this would come from a database.
import { allAchievements, leaderboardData } from "@/lib/leaderboard-data";
// Server Action to fetch AI-powered profile insights.
import { getProfileInsightsAction } from "./actions";
// TypeScript type definition for the AI insight data.
import type { ProfileInsightsOutput } from "@/ai/schemas";
// Utility function to calculate the user's gamified rank.
import { getHydrationRank } from "@/lib/utils";


// --- DEVELOPER OPTIONS COMPONENT ---
/**
 * A special component that simulates and displays raw data from the smart bottle.
 * This is intended for debugging and demonstration purposes.
 * It's a great way to see what kind of data the real hardware would be sending.
 * @returns {JSX.Element} An expandable section with simulated real-time data.
 */
const DeveloperOptions = () => {
  // --- STATE MANAGEMENT ---
  // `useState` is a React hook that lets you add a "state variable" to your component.
  // It's like a component's personal memory.

  // Stores the simulated water level from the bottle's sensor.
  const [waterLevel, setWaterLevel] = useState(0);
  // Stores the simulated X, Y, Z position from the MPU6050 accelerometer.
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  // Stores a log of simulated events from the bottle (e.g., "DRINK_DETECTED").
  const [eventLog, setEventLog] = useState<string[]>([]);

  // --- SIDE EFFECTS (DATA SIMULATION) ---
  // The `useEffect` hook lets you perform "side effects" in function components.
  // Side effects are actions that interact with the outside world, like fetching data,
  // setting up timers, or manually changing the screen.
  useEffect(() => {
    // 1. Set up intervals to simulate data changes.
    // An interval is a timer that runs a function repeatedly every X milliseconds.

    // Simulate water level changes every 500 milliseconds (half a second).
    const waterLevelInterval = setInterval(() => {
      setWaterLevel(Math.random() * 750); // Set a new random level between 0 and 750.
    }, 500);

    // Simulate accelerometer data changes every 10 milliseconds for a "real-time" feel.
    const positionInterval = setInterval(() => {
      setPosition({
        x: Math.random() * 2 - 1, // Random value between -1 and 1.
        y: Math.random() * 2 - 1,
        z: Math.random() * 2 - 1,
      });
    }, 10);

    // Simulate a new event being logged every 2 seconds.
    const eventLogInterval = setInterval(() => {
      // A list of possible events to randomly choose from.
      const events = [
        'DRINK_DETECTED amount:150ml', 'BOTTLE_STABLE', 'SYNC_REQUEST',
        'ALERT_TRIGGERED id:3', 'LOW_BATTERY level:15%', 'BOTTLE_IDLE',
        'REFILL_DETECTED', 'GOAL_REACHED'
      ];
      // Pick a random event from the list.
      const newEvent = events[Math.floor(Math.random() * events.length)];
      // Add the new event to the log. `setEventLog` can take a function to update the state
      // based on the previous state (`prev`). We add the new event to the beginning of the array
      // and use `slice(0, 50)` to keep the log from getting too long.
      setEventLog(prev => [`[${new Date().toLocaleTimeString()}] ${newEvent}`, ...prev].slice(0, 50));
    }, 2000);

    // --- CLEANUP ---
    // 2. This function is the "cleanup" function. It runs when the component is removed
    // from the screen. It's very important to clear the intervals here. If we don't,
    // they will keep running forever in the background, causing a "memory leak".
    return () => {
      clearInterval(waterLevelInterval);
      clearInterval(positionInterval);
      clearInterval(eventLogInterval);
    };
  }, []); // The empty array `[]` as the second argument means this effect will only run ONCE when the component first mounts.

  // --- RENDER LOGIC ---
  // This is the JSX that defines what the component looks like.
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5 text-accent" /> Developer Options
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* An Accordion is a UI element that can be expanded or collapsed. */}
        <Accordion type="single" collapsible className="w-full">
          {/* Real-time Bottle Data Section */}
          <AccordionItem value="item-1">
            <AccordionTrigger>Real-time Bottle Data (Demo)</AccordionTrigger>
            <AccordionContent className="space-y-4 font-mono text-xs">
              {/* This section shows the simulated sensor data. */}
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                <p className="flex items-center gap-2"><Droplet className="h-4 w-4 text-primary" /> Water Level:</p>
                <p>{waterLevel.toFixed(2)} mL</p>
              </div>
              <div className="p-2 bg-muted/50 rounded-md">
                <p className="flex items-center gap-2 mb-2"><Activity className="h-4 w-4 text-primary" /> MPU6050 Accelerometer:</p>
                <p>X: {position.x.toFixed(4)}</p>
                <p>Y: {position.y.toFixed(4)}</p>
                <p>Z: {position.z.toFixed(4)}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* Event Log Section */}
          <AccordionItem value="item-2">
            <AccordionTrigger>Event Log (Demo)</AccordionTrigger>
            <AccordionContent>
              {/* `ScrollArea` makes the content inside it scrollable if it's too big. */}
              <ScrollArea className="h-48 w-full bg-muted/50 rounded-md p-2">
                <div className="font-mono text-xs flex flex-col-reverse">
                  {/* We `map` over the `eventLog` array to create a <p> tag for each log entry. */}
                  {eventLog.map((log, i) => <p key={i}>{log}</p>)}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
           {/* App Philosophy Section */}
           <AccordionItem value="item-3">
            <AccordionTrigger>Behind the App: Our Philosophy</AccordionTrigger>
            <AccordionContent className="space-y-4 text-sm text-muted-foreground">
              <p>NEPHRA is more than just a smart water bottle; it's a behavioral change platform designed to make healthy habits enjoyable and sustainable.</p>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-2"><Info className="h-4 w-4 text-primary" /> Gamification Theory</h4>
                <p>We leverage core principles of gamification to transform hydration from a chore into an engaging quest. By incorporating points (Drops), levels, ranks, and achievements, we tap into intrinsic human motivators like competition, achievement, and collection. This creates a powerful positive feedback loop: drink water, get rewarded, feel accomplished, and want to continue.</p>
              </div>
               <div className="space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-2"><Bot className="h-4 w-4 text-primary" /> Hyper-Personalization with AI</h4>
                <p>Our AI Hydration Coach goes beyond generic advice. It analyzes your personal data—profile, activity patterns, and even self-reported health conditions—to provide actionable, personalized insights and goals. This ensures the journey is tailored to you, making the goals more meaningful and achievable.</p>
              </div>
               <div className="space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-2"><Trophy className="h-4 w-4 text-primary" /> Social Motivation</h4>
                <p>The leaderboard and shared achievements foster a sense of community and friendly competition. Seeing peers succeed is a powerful motivator, turning a personal goal into a shared social experience. Our Easter eggs and hidden challenges add a layer of discovery and delight, further strengthening engagement.</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};


/**
 * This is the main client component for the Profile page.
 * It manages the user's data, fetches AI insights, and displays all profile-related information.
 */
export default function ProfileClient() {
  // --- STATE MANAGEMENT ---
  // Stores the AI-generated insight for the user's profile. Initialized to `null`.
  const [insight, setInsight] = useState<ProfileInsightsOutput | null>(null);
  // Manages the loading state while fetching the AI insight. This is useful for showing a "Loading..." message.
  const [isLoadingInsight, setIsLoadingInsight] = useState(true);

  // --- DATA ---
  // For this demo, we're assuming the logged-in user is the first one in our mock data.
  // In a real app, you would get the current user's ID from an authentication system.
  const user = leaderboardData[0];
  // Get the achievements for this specific user from our mock data.
  const achievements = allAchievements[1] || [];

  // --- DERIVED STATE ---
  // "Derived state" is data that is calculated from other pieces of state or props.
  // We calculate it directly in the render function instead of storing it in state
  // because it saves memory and prevents bugs.

  // Calculate how many achievements the user has unlocked.
  const achievedCount = achievements.filter(a => a.achieved).length;
  // Get the user's current rank details (e.g., name, next rank, progress).
  const hydrationRank = getHydrationRank(user.level);

  // --- SIDE EFFECTS (DATA FETCHING) ---
  // This `useEffect` hook fetches the personalized AI insight when the component first loads.
  useEffect(() => {
    // 1. We define an `async` function inside the effect. This is the standard way to
    // handle asynchronous operations (like API calls) inside `useEffect`.
    async function fetchInsight() {
      // 2. Set loading state to true to show a loading message on the screen.
      setIsLoadingInsight(true);
      // 3. Create mock historical data for the AI analysis. In a real app, this would be fetched from a database.
      const mockHistoricalData = JSON.stringify([
        { timestamp: '2024-07-28T08:00:00Z', amount: 250 },
        { timestamp: '2024-07-29T09:30:00Z', amount: 300 },
        { timestamp: '2024-07-30T08:30:00Z', amount: 200 },
        { timestamp: '2024-07-30T15:00:00Z', amount: 150 },
      ]);

      // 4. Call the Server Action to get the AI insight. `await` pauses the function
      // until the AI has finished its analysis and returned a result.
      const result = await getProfileInsightsAction({
        name: user.name,
        level: user.level,
        hydrationRank: hydrationRank.rank,
        historicalData: mockHistoricalData,
        healthConditions: "menstruation" // We add mock data for health to get more personalized results.
      });

      // 5. If the AI returns a valid result, update our component's state with it.
      if (result) {
        setInsight(result);
      }
      // 6. Set the loading state to false, which will hide the loading message.
      setIsLoadingInsight(false);
    }
    // 7. Call the async function we just defined.
    fetchInsight();
    // The dependency array `[]` tells React to run this effect only once, when the component mounts.
    // If we put variables in the array (e.g., `[user.id]`), the effect would re-run whenever those variables change.
  }, [user.name, user.level, hydrationRank.rank]);

  // --- RENDER LOGIC ---
  return (
    <div className="p-4 space-y-8">
      {/* --- HEADER --- */}
      <header className="mb-2 text-center">
        <h1 className="text-2xl font-headline font-bold mt-4">Your Profile</h1>
        <p className="text-muted-foreground">Update your details and view your progress.</p>
      </header>
      
      <Separator />

      {/* --- CORE STATS SECTION --- */}
      <div className="grid grid-cols-3 text-center divide-x divide-border">
        {/* Level */}
        <div className="flex flex-col items-center">
          <Star className="h-6 w-6 text-yellow-500 mb-1" />
          <p className="text-xl font-bold">{user.level}</p>
          <p className="text-xs text-muted-foreground">Level</p>
        </div>
        {/* Streak */}
        <div className="flex flex-col items-center">
          <Flame className="h-6 w-6 text-orange-500 mb-1" />
          <p className="text-xl font-bold">{user.streak}</p>
          <p className="text-xs text-muted-foreground">Streak</p>
        </div>
        {/* Rank */}
        <div className="flex flex-col items-center">
          <ShieldCheck className="h-6 w-6 text-primary mb-1" />
          <p className="text-xl font-bold">{hydrationRank.rank}</p>
          <p className="text-xs text-muted-foreground">Rank</p>
        </div>
      </div>

      {/* --- RANK PROGRESS VISUALIZATION --- */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline text-sm">
          <p className="font-semibold">{hydrationRank.rank}</p>
          <p className="text-muted-foreground">Next Rank: {hydrationRank.nextRank}</p>
        </div>
        <Progress value={hydrationRank.progress} className="h-2" />
      </div>

      <Separator />

      {/* --- AI COACHING SECTION --- */}
      <div>
        <h2 className="text-lg font-headline font-semibold mb-2 flex items-center gap-2"><Bot className="h-5 w-5 text-primary" /> AI Hydration Coach</h2>
        {/* Use a conditional (ternary) operator to show a loading message or the AI insight. */}
        {isLoadingInsight ? (
          <p className="text-sm text-muted-foreground">Analyzing your patterns...</p>
        ) : (
          <p className="text-sm italic text-muted-foreground">"{insight?.insight}"</p>
        )}
      </div>

      {/* --- PROFILE FORM --- */}
      {/* This component handles the user's personal details and AI goal generation. */}
      <ProfileForm />

      <Separator />

      {/* --- ACHIEVEMENTS SECTION --- */}
      <div className="pt-4">
        <h2 className="text-xl font-headline font-bold text-center mb-2">Achievements</h2>
        <div className="flex justify-center items-center gap-4 mb-4">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <p className="text-muted-foreground">{achievedCount} / {achievements.length} Unlocked</p>
        </div>
        <Progress value={(achievedCount / achievements.length) * 100} className="h-2" />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
          {/* We `map` over the achievements array to display each one in a card. */}
          {achievements.map((ach, i) => (
            <Card key={i} className={`text-center transition-all duration-300 ${ach.achieved ? 'border-primary/50 bg-primary/10' : 'bg-card'}`}>
              <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-2 ${ach.achieved ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {/* The `ach.icon` is a component itself, so we can render it like this. */}
                  <ach.icon className={`h-6 w-6 ${ach.achieved ? '' : 'text-muted-foreground'}`} />
                </div>
                <p className="font-semibold text-sm">{ach.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* --- FOOTER & DEVELOPER SECTION --- */}
      <div className="text-center space-y-4 pt-4">
        {/* The developer options component for displaying raw data. */}
        <DeveloperOptions />
        {/* A link to the developer's website. `target="_blank"` opens it in a new tab. */}
        <Link href="https://linktr.ee/aletheion" target="_blank" className="text-xs text-muted-foreground hover:text-primary transition-colors">
          Designed by Aletheion Labs in India
        </Link>
      </div>

    </div>
  );
}
