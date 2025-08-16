// This special line tells Next.js that this file is a "Client Component".
// This means it runs in the user's browser, which allows it to be interactive
// and use features like state and event listeners (e.g., button clicks).
"use client";

// --- IMPORTS ---
// We import the tools we need from React, which is the library we use to build the UI.
import React from 'react';
// We import icons from a library called `lucide-react` to make our app look nice.
import { RefreshCw, Zap, Droplets, Flame, Bot, ShieldCheck } from 'lucide-react';
// We import our own custom UI components that we've built for this app.
// This keeps our app's style consistent.
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import ProgressRing from '@/components/dashboard/progress-ring';
// This is a "custom hook" we wrote to easily show pop-up notifications (called "toasts").
import { useToast } from '@/hooks/use-toast';
// This is a "type" definition from our AI schemas. It helps us make sure the data
// for our AI's motivational messages is always in the correct format.
import type { MotivationOutput } from '@/ai/schemas';
// This is a helper function we wrote to calculate the user's "rank" based on their level.
import { getHydrationRank } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// --- COMPONENT PROPS DEFINITION ---
// This is a "TypeScript interface". It's like a blueprint that defines what kind of
// data (or "props") this component expects to receive from its parent.
interface DashboardClientProps {
  // `initialMotivation` is the first message the AI gives us when the app loads.
  initialMotivation: MotivationOutput;
}

/**
 * This is the main component for our Dashboard page. It's called "DashboardClient"
 * because it's a Client Component. It manages all the changing data (state),
 * handles user actions (like button clicks), and displays the user's daily progress.
 */
export default function DashboardClient({ initialMotivation }: DashboardClientProps) {
  // --- STATE MANAGEMENT ---
  // The `useState` hook is a special React function that lets you add a "state variable"
  // to your component. Think of it as the component's internal memory. When a state
  // variable changes, React automatically re-renders the component to show the new data.

  // This state variable keeps track of whether the smart bottle is connected.
  const [isConnected, setIsConnected] = React.useState(false);
  // This state stores the user's daily hydration goal and how much they've drunk so far.
  const [hydration, setHydration] = React.useState({ current: 0, goal: 2500 });
  // This state tracks the current water level in the smart bottle (max 750ml).
  const [bottleLevel, setBottleLevel] = React.useState(750);
  // This state stores the user's "streak" (how many days in a row they've met their goal).
  const [streak, setStreak] = React.useState(0);
  // This state holds the AI-generated motivational message. We initialize it with the
  // `initialMotivation` prop that was passed in from the server.
  const [motivation, setMotivation] = React.useState<MotivationOutput>(initialMotivation);
  
  // --- GAMIFICATION STATE ---
  // These state variables manage the "game" elements of our app, like levels and points.
  const [level, setLevel] = React.useState(1); // The user's current level.
  const [xp, setXp] = React.useState(0); // The user's current experience points.
  const [drops, setDrops] = React.useState(0); // The in-game "money" the user earns.

  // This state is a clever trick to safely show a "level up" notification.
  // When a user levels up, we'll store the new level number here. A `useEffect` hook
  // below will watch this variable and show the notification when it changes.
  const [levelUpInfo, setLevelUpInfo] = React.useState<number | null>(null);

  // --- HOOKS ---
  // We use our custom `useToast` hook to get the `toast` function, which we can call
  // to show notifications on the screen.
  const { toast } = useToast();

  // A sample list of quests. In a real app, this would probably come from a database.
  // We define it here to make the dashboard feel more complete.
  const weeklyQuests = [
    { id: 1, title: "The 3-Day Streak", description: "Maintain your streak for 3 days.", progress: 100, goal: 3, reward: 50 },
    { id: 2, title: "Weekend Warrior", description: "Drink 5000ml over the weekend.", progress: 50, goal: 5000, reward: 100 },
    { id: 3, title: "Perfect Start", description: "Hit your goal before noon.", progress: 0, goal: 1, reward: 75 },
  ]

  // --- DERIVED STATE & UTILITIES ---
  // These are values that are calculated from our existing state variables.
  // We calculate them directly during rendering instead of storing them in state.
  // This is more efficient and prevents our state from becoming messy or out of sync.

  // Calculate the amount of XP needed to reach the next level. The formula is simple: level * 100.
  const xpToNextLevel = level * 100;
  // Get the user's current rank details (like the rank name, e.g., "Scout") based on their level.
  const hydrationRank = getHydrationRank(level);
  
  // --- SIDE EFFECTS ---
  // The `useEffect` hook lets you perform "side effects" in components. Side effects are
  // operations that interact with the outside world, like timers, data fetching, or
  // directly manipulating the browser's DOM.

  // This `useEffect` hook simulates the smart bottle sending data to the app.
  // It only runs when the bottle is connected (`isConnected` is true).
  React.useEffect(() => {
    // 1. Check if the bottle is "connected".
    if (isConnected) {
      // 2. `setInterval` is a browser function that runs a piece of code repeatedly,
      // with a fixed time delay between each run. Here, we'll simulate a data update
      // every 2 seconds (2000 milliseconds).
      const interval = setInterval(() => {
        
        // --- Simulate Drinking ---
        // 3. We generate a random amount of water the user "drank".
        // This makes the demo feel alive and dynamic.
        const drank = 50 * (Math.floor(Math.random() * 3) + 1); // Simulate drinking 50, 100, or 150 ml
        
        // 4. If the user "drank" some water, we update all the relevant stats.
        if (drank > 0) {
          // --- XP and Leveling Logic ---
          // `setXp` can take a function. This is the safest way to update state
          // that depends on the previous state.
          setXp(currentXp => {
            const newXp = currentXp + drank;
            // Check if the user has earned enough XP to level up.
            if (newXp >= xpToNextLevel) {
              // If so, we update the level.
              setLevel(prevLevel => {
                const newLevel = prevLevel + 1;
                // We store the new level in our special `levelUpInfo` state.
                // This will trigger the other `useEffect` to show the notification.
                setLevelUpInfo(newLevel); 
                return newLevel;
              });
              // We reset the XP for the new level, carrying over any extra XP.
              return newXp - xpToNextLevel; 
            }
            // If they didn't level up, we just return the new XP amount.
            return newXp;
          });
          
          // --- Update Hydration and Bottle State ---
          setHydration(prev => ({ ...prev, current: Math.min(prev.current + drank, prev.goal) }));
          setBottleLevel(lvl => Math.max(0, lvl - drank)); // `Math.max` ensures bottle level doesn't go below 0.
          setDrops(d => d + Math.floor(drank / 10)); // We grant some "drops" currency based on the amount drunk.
        }
      }, 2000); // This happens every 2000ms (2 seconds).

      // 6. This is the "cleanup" function. It's very important! It runs when the
      // component is removed from the screen or when the values in the dependency array change.
      // Here, it stops the interval timer to prevent it from running forever in the background,
      // which would cause a "memory leak" and slow down the app.
      return () => clearInterval(interval);
    }
    // The "dependency array" tells React when to re-run this effect.
    // The effect will run again if any of these values (`isConnected`, `xpToNextLevel`, `level`) change.
  }, [isConnected, xpToNextLevel, level]);

  // This `useEffect` hook is dedicated to safely showing the "Level Up" notification.
  // It runs *only* when the `levelUpInfo` state changes.
  React.useEffect(() => {
    // If `levelUpInfo` has a new level number (i.e., it's not null)...
    if (levelUpInfo) {
      // ...we call the `toast` function to show the notification.
      toast({ title: "Level Up!", description: `Congratulations, you've reached level ${levelUpInfo}!` });
      // After showing the toast, we reset the info back to `null`. This is crucial
      // so the toast doesn't pop up again every time the component re-renders.
      setLevelUpInfo(null);
    }
    // This effect depends on `levelUpInfo` and the `toast` function.
  }, [levelUpInfo, toast]);


  // --- EVENT HANDLERS ---
  // These are functions that we create to respond to user interactions, like button clicks.

  // This function handles the "Connect" button click.
  const handleConnect = () => {
    // We set the connection status to true.
    setIsConnected(true);
    // We show a toast notification to confirm that the bottle is connected.
    toast({ title: "NEPHRA Connected", description: "Ready to track your hydration." });
    
    // We reset all the stats to their starting values for a fresh demo session.
    setHydration({ current: 0, goal: 2500 });
    setBottleLevel(750);
    setStreak(5); // Start with a sample streak to make it look good.
    setLevel(1);
    setXp(0);
    setDrops(0);
  };
  
  // This function handles the "Sync" button click.
  const handleSync = () => {
    // We show a "syncing" notification to give the user feedback.
    toast({ title: "Syncing Data...", description: "Fetching latest events from your bottle." });
    // We use `setTimeout` to simulate a delay, like a real network request.
    setTimeout(() => {
        // After 1.5 seconds, we show a "sync complete" notification.
        toast({ title: "Sync Complete", description: "Your hydration data is up-to-date." });
    }, 1500)
  }

  // --- RENDER LOGIC ---
  // This is the part of the component that returns the JSX, which is the code
  // that describes what the UI should look like.
  
  // Calculate the hydration progress as a percentage.
  const progress = (hydration.current / hydration.goal) * 100;
  // Calculate how much water the user has left to drink to meet their goal.
  const waterRemaining = hydration.goal - hydration.current;

  return (
    <div className="p-4 space-y-6">
      {/* --- HEADER --- */}
      <header className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold font-headline">Joan Clarke's</h1>
            <p className="text-muted-foreground">Dashboard</p>
        </div>
        {/* This is the little dot that shows if the bottle is connected. */}
        <div className="flex items-center gap-2">
            {/* The dot has a green or red color and a pulsing animation. */}
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
            <span className="text-sm text-muted-foreground">{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
      </header>
      
       {/* --- DISCONNECTED VIEW --- */}
       {/* We use a conditional (ternary) operator. It's a compact `if/else` statement. */}
       {/* `!isConnected ? (show this) : (show that)` */}
       {!isConnected ? (
        // If the bottle is NOT connected, we show a big "Connect" button.
        <div className="text-center pt-20">
            <Button onClick={handleConnect} size="lg" className="w-full animate-pulse bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg">
                <Zap className="mr-2 h-4 w-4" /> Connect to NEPHRA
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Connect to start the demo simulation.
            </p>
        </div>
       ) : (
        // --- CONNECTED VIEW ---
        // If the bottle IS connected, we show the main dashboard content.
        <div className="space-y-6">
            {/* --- XP and Level Bar --- */}
            <div className="space-y-2">
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <p>Level {level} ({hydrationRank.rank})</p>
                    {/* Display the user's "drops" currency. */}
                    <p className="flex items-center gap-1"><Droplets className="h-4 w-4 text-primary"/>{drops}</p>
                </div>
                {/* The progress bar shows how close the user is to the next level. */}
                <Progress value={(xp / xpToNextLevel) * 100} className="h-3" />
                 <p className="text-xs text-muted-foreground text-right">{xp} / {xpToNextLevel} XP</p>
            </div>
            
            {/* --- Main Hydration Progress Ring --- */}
            <div className="flex flex-col justify-center items-center py-4 space-y-4">
              {/* This is our custom component that visually represents the daily goal progress. */}
              <ProgressRing progress={progress} waterRemaining={waterRemaining} />
            </div>

            {/* --- AI Motivational Message --- */}
            <div className="text-center">
              <p className="font-semibold flex items-center justify-center gap-2 text-primary"><Bot className="h-5 w-5" /> {motivation.title}</p>
              <p className="text-sm text-muted-foreground">{motivation.message}</p>
            </div>
            
            {/* --- Quick Stats Panel --- */}
            <div className="grid grid-cols-2 gap-2 text-center bg-card/50 p-3 rounded-xl">
                {/* Streak Counter */}
                <div className="flex flex-col items-center justify-center">
                    <Flame className="h-7 w-7 text-accent mb-1"/>
                    <p className="text-lg font-bold">{streak}</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
                 {/* Bottle Water Level */}
                 <div className="flex flex-col items-center justify-center">
                    <div className="relative h-7 w-7">
                        <Droplets className="h-full w-full text-blue-400" />
                        {/* We show the percentage of water left in the bottle right on top of the icon. */}
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-background">{Math.round((bottleLevel / 750) * 100)}%</span>
                    </div>
                    <p className="text-lg font-bold">{bottleLevel.toFixed(0)} <span className="text-sm">mL</span></p>
                    <p className="text-xs text-muted-foreground">Bottle</p>
                </div>
            </div>

            <Separator />

            {/* --- Weekly Quests Section --- */}
            <div className="space-y-4">
                <div>
                   <h2 className="text-lg font-headline font-semibold mb-2 flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary"/>
                        Weekly Quests
                    </h2>
                    {/* The list of quests is displayed here. */}
                    <div className="space-y-4 p-4 rounded-lg bg-card/50">
                        {/* We `map` over the `weeklyQuests` array to create a UI element for each quest. */}
                        {/* The `key` is important for React to keep track of each item in the list efficiently. */}
                        {weeklyQuests.map((quest) => (
                            <div key={quest.id}>
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-sm font-semibold">{quest.title}</p>
                                    <p className="text-sm font-medium flex items-center gap-1 text-accent">
                                        <Droplets className="h-4 w-4" /> +{quest.reward}
                                    </p>
                                </div>
                                <Progress value={quest.progress} className="h-2" />
                                <p className="text-xs text-muted-foreground mt-1">{quest.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* --- Manual Sync Button --- */}
            <Button variant="outline" className="w-full" onClick={handleSync}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Manually
            </Button>
        </div>
      )}

    </div>
  );
}
