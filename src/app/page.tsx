/**
 * @fileOverview This is the root page of the application.
 *
 * Its only job is to redirect the user to the main dashboard. This provides a clean
 * entry point to the app. For example, navigating to `yourapp.com/` will automatically
 * take the user to `yourapp.com/dashboard`.
 */

// Import the `redirect` function from Next.js for handling server-side redirects.
import { redirect } from 'next/navigation';

/**
 * The Home component for the root route (`/`).
 */
export default function Home() {
  // Immediately redirect the user to the '/dashboard' page.
  redirect('/dashboard');
  // Since we are redirecting, we don't need to render any HTML, so we return null.
  return null;
}
