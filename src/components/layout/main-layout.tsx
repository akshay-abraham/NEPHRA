// This directive marks this as a Client Component. A Client Component can use
// React features like state and lifecycle hooks. Since our `SettingsProvider`
// uses these, this component must also be a Client Component.
"use client";

// --- IMPORTS ---
import type React from 'react'; // We import React's types for better code quality.
import BottomNav from './bottom-nav'; // We import the bottom navigation bar component.
import { SettingsProvider } from '@/hooks/use-settings.tsx'; // We import our custom SettingsProvider.

/**
 * This is the main layout component for the entire application.
 * It acts as a wrapper around every page, providing a consistent structure.
 * Think of it as the master template for our app's screen.
 * @param {object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - This special prop represents any child components
 *   that are passed to `MainLayout`. In our case, this will be the actual page content
 *   (like the Dashboard, Timeline, etc.).
 * @returns {JSX.Element} The main application layout structure.
 */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  // This is the JSX that defines what the component looks like.
  return (
    // We wrap everything in our `SettingsProvider`. This makes the global settings
    // (like `isMobile`) available to all components rendered within it.
    <SettingsProvider>
      {/* This is the main container for the app's UI. */}
      {/* It's styled to look like a mobile phone screen, centered on the page. */}
      <div className="relative mx-auto h-[100dvh] max-w-sm overflow-hidden border-x border-border/20 bg-background text-foreground flex flex-col">
        
        {/* The `<main>` HTML tag is used for the primary content of a page. */}
        {/* `flex-1` makes it grow to fill all available vertical space. */}
        {/* `overflow-y-auto` makes the content scrollable if it gets too long to fit on the screen. */}
        {/* `pb-24` adds padding to the bottom. This is important to prevent the content from being */}
        {/* hidden behind the fixed bottom navigation bar. */}
        <main className="flex-1 overflow-y-auto pb-24">{children}</main>
        
        {/* The BottomNav component is placed here, outside the main scrollable area. */}
        {/* This ensures that it's always visible at the bottom of the screen, no matter where the user scrolls. */}
        <BottomNav />
      </div>
    </SettingsProvider>
  );
}
