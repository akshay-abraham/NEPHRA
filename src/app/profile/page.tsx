/**
 * @fileOverview This file is the entry point for the main user profile page (`/profile`).
 *
 * It's a simple Server Component that acts as a container. Its only job is to
 * render the `ProfileClient` component, which handles all the interactive logic.
 * This separation is a common pattern in Next.js.
 */

// Import the client component that contains the actual UI and logic for the profile page.
import ProfileClient from "./profile-client";

/**
 * The main component for the Profile page route.
 * @returns {JSX.Element} The ProfileClient component.
 */
export default function ProfilePage() {
    // This page simply renders the ProfileClient component.
    // All state, user interactions, and data fetching are handled within ProfileClient.
    return <ProfileClient />;
}
