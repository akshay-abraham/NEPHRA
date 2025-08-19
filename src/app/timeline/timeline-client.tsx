// This directive tells Next.js that this is a Client Component.
// Client Components are interactive and can use state and effects.
"use client";

// --- IMPORTS ---
import { useState } from 'react'; // Core React hook for managing state.
import { Button } from '@/components/ui/button'; // Custom button component.
import { ChevronLeft, ChevronRight, Droplet, Plus, Star, Trophy, Zap } from 'lucide-react'; // Icons.
import { addDays, format, isSameDay, subDays } from 'date-fns'; // Utility functions for working with dates.
import { Calendar } from '@/components/ui/calendar'; // Custom calendar component.

// --- MOCK DATA ---
// In a real application, this data would be fetched from a database.
// Here, we use a mock array to simulate a user's historical events.
const mockEvents = [
  { id: 1, date: new Date(), time: '08:15 AM', type: 'drink', amount: 250, total: 250 },
  { id: 2, date: new Date(), time: '09:00 AM', type: 'achievement', title: "Daily Goal Crusher" },
  { id: 3, date: new Date(), time: '09:30 AM', type: 'drink', amount: 150, total: 400 },
  { id: 4, date: subDays(new Date(), 1), time: '11:00 AM', type: 'refill', amount: 500 },
  { id: 5, date: subDays(new Date(), 1), time: '11:05 AM', type: 'drink', amount: 300, total: 300 },
  { id: 6, date: subDays(new Date(), 2), time: '01:20 PM', type: 'drink', amount: 200, total: 200 },
  { id: 7, date: subDays(new Date(), 2), time: '03:00 PM', type: 'drink', amount: 150, total: 350 },
  { id: 8, date: subDays(new Date(), 2), time: '05:00 PM', type: 'quest', title: "Weekend Warrior", completed: true },
];

// --- DATA MAPPINGS ---
// These objects map event types to their corresponding icons and colors.
// This makes the code cleaner and easier to maintain.
const eventIcons: { [key: string]: React.ElementType } = {
  drink: Droplet,
  refill: Plus,
  achievement: Trophy,
  quest: Star,
  challenge: Zap,
};

const eventColors: { [key: string]: string } = {
  drink: "text-primary",
  refill: "text-green-500",
  achievement: "text-yellow-500",
  quest: "text-accent",
  challenge: "text-red-500",
}

/**
 * This is the main client component for the Timeline page.
 * It handles date selection, filtering events, and displaying the event log.
 */
export default function TimelineClient() {
  // --- STATE MANAGEMENT ---
  // `useState` creates a state variable to hold the currently selected date.
  // It's initialized to the current day (`new Date()`).
  const [currentDate, setCurrentDate] = useState(new Date());

  // --- EVENT HANDLERS ---
  /**
   * Changes the `currentDate` by a given offset.
   * @param {number} offset - The number of days to add or subtract (e.g., 1 or -1).
   */
  const changeDay = (offset: number) => {
    setCurrentDate(current => addDays(current, offset));
  };
  
  // --- DATA FILTERING ---
  // Filter the `mockEvents` array to get only the events for the `currentDate`.
  // The `isSameDay` function from `date-fns` makes this easy.
  const todaysEvents = mockEvents.filter(e => isSameDay(e.date, currentDate));

  // --- RENDER LOGIC ---
  return (
    <div className="p-4 space-y-4">
      {/* --- Date Navigation Header --- */}
      <header className="flex justify-between items-center px-2">
        {/* Button to go to the previous day. */}
        <Button variant="ghost" size="icon" onClick={() => changeDay(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        {/* Display the currently selected date, formatted nicely. */}
        <h1 className="text-lg font-headline font-semibold text-center">
          {format(currentDate, 'eeee, MMM d')}
        </h1>
        {/* Button to go to the next day. */}
        <Button variant="ghost" size="icon" onClick={() => changeDay(1)}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </header>

      {/* --- Calendar View --- */}
      <div className="flex justify-center">
        <Calendar
          mode="single" // We only want to select one day at a time.
          selected={currentDate} // The currently selected day.
          onSelect={(date) => date && setCurrentDate(date)} // Update state when a new day is clicked.
          className="p-0 border-0 shadow-none bg-transparent" // Minimal styling.
          // Custom styles for selected and today's date markers.
          modifiersStyles={{
              selected: {
                  backgroundColor: 'hsl(var(--accent))',
                  color: 'hsl(var(--accent-foreground))',
              },
              today: {
                 color: 'hsl(var(--primary))',
              }
          }}
        />
      </div>
      
      {/* --- Event Log --- */}
      <div className="relative space-y-6 py-4">
        {/* This is the vertical line that runs down the center of the timeline. */}
        <div className="absolute left-5 top-0 h-full w-0.5 bg-border/50 -z-10"></div>
        
        {/* Map over the filtered events for the selected day. */}
        {todaysEvents.map((event) => {
          // Look up the correct icon and color for the event type.
          const Icon = eventIcons[event.type] || Droplet;
          const color = eventColors[event.type] || "text-primary";
          
          return (
            <div key={event.id} className="flex items-center gap-4 pl-1">
              {/* The circular icon holder on the timeline. */}
              <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-card ring-4 ring-background`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              {/* The event details. */}
              <div className="flex-grow">
                 {/* Conditionally render the event details based on the event type. */}
                 {event.type === 'drink' && (
                    <div className="flex justify-between items-baseline">
                      <p className="font-semibold">Drank {event.amount} mL</p>
                      <p className="text-xs text-muted-foreground">{event.total} mL Total</p>
                    </div>
                )}
                {event.type === 'refill' && <p className="font-semibold">Refilled {event.amount} mL</p>}
                {event.type === 'achievement' && <p className="font-semibold">Unlocked: <span className="text-yellow-500">{event.title}</span></p>}
                {event.type === 'quest' && <p className="font-semibold">Quest Complete: <span className="text-accent">{event.title}</span></p>}
                {/* The time of the event. */}
                <p className="text-sm text-muted-foreground">{event.time}</p>
              </div>
            </div>
          );
        })}
        
        {/* If there are no events for the selected day, show a message. */}
        {todaysEvents.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
                <p>No hydration events recorded for this day.</p>
            </div>
        )}
      </div>
    </div>
  );
}
