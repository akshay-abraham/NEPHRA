// This special line tells Next.js that this file is for the "client-side" (the user's browser).
// This allows it to use special React features like state and context.
"use client";

// --- IMPORTS ---
// We import the tools we need from the React library to create "context" and manage "state".
// Think of context as a global data store for a part of your app.
// State is like a component's memory.
import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
// We import our custom hook that checks if the user is on a mobile device.
import { useIsMobile } from "@/hooks/use-mobile";

// --- TYPE DEFINITIONS ---
// This is like a blueprint for our settings object. It's currently empty because
// we have removed the "working" vs "demo" mode switch, but we keep it in case
// we want to add new global settings later (like a theme switcher).
export type Settings = {
  // We can add future settings here, for example: theme: "light" | "dark";
};

// This is the blueprint for our "context". It tells other components what data
// and functions they can expect to receive from it.
type SettingsContextType = {
  // `isMobile` is a boolean (true or false) that tells us if the app is on a small screen.
  isMobile: boolean;
};

// --- CONTEXT CREATION ---
// Here, we create the actual context object. We initialize it with `null`.
// The `SettingsProvider` component below will provide the real value.
const SettingsContext = createContext<SettingsContextType>(null as any);

// --- CUSTOM HOOK ---

/**
 * A "custom hook" is a reusable function that lets components "hook into" React features.
 * This `useSettings` hook is a clean and easy way for any component to get the settings data.
 * @returns {SettingsContextType} The settings context, including `isMobile`.
 */
export function useSettings() {
  // `useContext` is the standard React hook to read the value from a context.
  const context = useContext(SettingsContext);

  // This is a safety check. If a component tries to use this hook but it's not
  // wrapped in a `SettingsProvider`, the `context` will be `null`. We throw an
  // error to let the developer know they made a mistake.
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }

  // If everything is good, we return the context data.
  return context;
}

// --- PROVIDER COMPONENT ---

/**
 * A "Provider" is a special component that "provides" a value to all the components
 * inside of it. This `SettingsProvider` will wrap our entire app, making the settings
 * available everywhere.
 * @param {object} props - The properties passed to the component.
 * @param {ReactNode} props.children - The child components that will be rendered inside.
 * @returns {JSX.Element} The context provider wrapping the children.
 */
export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  // We call our `useIsMobile` hook to find out if the user is on a phone.
  const isMobile = useIsMobile();
  
  // `useMemo` is a React hook for performance. It makes sure the `value` object
  // is only created once and doesn't change unless `isMobile` changes.
  // This prevents unnecessary re-renders in components that use the context.
  const value = useMemo(
    () => ({
      isMobile,
    }),
    [isMobile]
  );

  // The `Provider` component makes the `value` object (which contains `isMobile`)
  // available to all descendant components that call the `useSettings` hook.
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
