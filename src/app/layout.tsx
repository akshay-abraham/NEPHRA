/**
 * @fileOverview This is the root layout for the entire application.
 *
 * It wraps every page with a consistent HTML structure, including the `<html>` and `<body>` tags.
 * It's where we define global styles, fonts, and providers that need to be available everywhere.
 */

// --- IMPORTS ---
// Import the `Metadata` type from Next.js to define page metadata (like the title).
import type { Metadata } from 'next';
// Import the global stylesheet.
import './globals.css';
// Import the Toaster component, which is responsible for displaying notifications.
import { Toaster } from '@/components/ui/toaster';
// Import the main layout component, which includes the bottom navigation bar.
import MainLayout from '@/components/layout/main-layout';

// --- METADATA ---
// This will be used in the `<head>` of the HTML document for SEO and browser tab information.
export const metadata: Metadata = {
  title: 'HydrateAI',
  description: 'NEPHRA Smart Hydration App',
};

// --- COMPONENT DEFINITION ---
/**
 * This is the RootLayout component. It receives other components (pages) as `children`.
 * @param {object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The child components to be rendered inside this layout.
 * @returns {JSX.Element} The root HTML structure for the application.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The `return` statement defines the component's UI using JSX.
  return (
    // The `<html>` element is the root of the document.
    // We set the language to English and apply the "dark" class to enable dark mode globally.
    <html lang="en" className="dark">
      <head>
        {/* We connect to Google Fonts to load our custom fonts. */}
        {/* `rel="preconnect"` helps the browser establish an early connection, which can speed up font loading. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Load the 'Montserrat' font for headlines (weights 500 and 700). */}
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap" rel="stylesheet" />
        {/* Load the 'Roboto' font for body text (weights 400, 500, and 700). */}
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      {/* The `<body>` element contains all the visible content. */}
      {/* We apply our custom body font and anti-aliasing for smoother text rendering. */}
      <body className="font-body antialiased bg-background">
          {/* The MainLayout component wraps the page content and includes the bottom nav bar. */}
          <MainLayout>{children}</MainLayout>
          {/* The Toaster component is placed here so it can display notifications over any page. */}
          <Toaster />
      </body>
    </html>
  );
}
