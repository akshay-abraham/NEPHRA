// This directive marks this as a Client Component, allowing it to use hooks like `usePathname`.
"use client";

// --- IMPORTS ---
import Link from 'next/link'; // For client-side navigation between pages.
import { usePathname } from 'next/navigation'; // A hook to get the current URL path.
import { LayoutDashboard, History, Trophy, User } from 'lucide-react'; // Icons for the nav items.
import { cn } from '@/lib/utils'; // A utility function for conditionally joining class names.

// --- NAVIGATION DATA ---
// An array of objects defining the items in the bottom navigation bar.
// This makes it easy to add, remove, or change navigation items.
const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/timeline', label: 'Timeline', icon: History },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: User },
];

/**
 * A component that renders the main bottom navigation bar for the app.
 * It highlights the currently active page.
 */
export default function BottomNav() {
  // Get the current URL path (e.g., "/dashboard", "/profile").
  // This is used to determine which nav item is "active".
  const pathname = usePathname();

  return (
    // The `<nav>` element is a semantic container for navigation links.
    // It's fixed to the bottom of the screen and has a blurred background for a modern look.
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm border-t border-black/20 bg-background/50 backdrop-blur-xl">
      <div className="flex justify-around items-center h-16">
        {/* We `map` over the `navItems` array to create a link for each item. */}
        {navItems.map((item) => {
          // Check if the current item's link matches the current URL path.
          const isActive = pathname === item.href;
          
          return (
            // Use the Next.js `Link` component for fast, client-side navigation.
            // The styles and logic are applied directly to the Link component.
            <Link
              key={item.href}
              href={item.href}
              // The `cn` function conditionally applies classes.
              // If `isActive` is true, it adds "text-primary scale-110" for a highlighted effect.
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground transition-all duration-300 ease-in-out hover:text-primary hover:scale-110",
                isActive ? "text-primary scale-110" : "scale-100"
              )}
            >
              {/* Render the icon for the navigation item. */}
              <item.icon className="h-5 w-5" />
              {/* Render the label for the navigation item. */}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
