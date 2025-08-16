/**
 * @fileOverview This file is the entry point for the Timeline page.
 *
 * It's a simple Server Component whose only job is to render the `TimelineClient`
 * component. This keeps the server-side logic clean and delegates all the
 * interactive functionality to the client.
 */

// Import the client component that will handle all the interactive parts of the timeline.
import TimelineClient from '@/app/timeline/timeline-client';

/**
 * The main component for the Timeline page route.
 * @returns {JSX.Element} The TimelineClient component.
 */
export default function TimelinePage() {
  // This page simply renders the TimelineClient component. All the logic for
  // handling dates, events, and user interaction is contained within it.
  return <TimelineClient />;
}
