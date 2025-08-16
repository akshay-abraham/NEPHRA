// Import React for creating components and the `cn` utility for combining class names.
import * as React from "react"
import { cn } from "@/lib/utils"

// --- Card Component ---
// This is the main container for a card. It's a `div` with styling for a card-like appearance.
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    // `cn` combines the default card styles with any additional classes passed in `className`.
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow-lg shadow-black/20",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card" // Set a display name for easier debugging in React DevTools.

// --- CardHeader Component ---
// A container for the top section of a card, typically holding the title and description.
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

// --- CardTitle Component ---
// A styled `h3` element for the card's title.
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// --- CardDescription Component ---
// A styled `p` element for the card's description or subtitle.
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// --- CardContent Component ---
// The main content area of the card.
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

// --- CardFooter Component ---
// A container for the bottom section of a card, often used for action buttons.
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Export all the components so they can be used throughout the application.
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
