// This directive marks this as a Client Component, allowing it to use React hooks.
"use client";

// Import React and the Droplets icon.
import React from 'react';
import { Droplets } from 'lucide-react';

// Define the shape of the props that this component accepts using a TypeScript interface.
interface ProgressRingProps {
  progress: number; // The progress percentage (0-100).
  waterRemaining: number; // The amount of water remaining in mL.
  size?: number; // Optional: the width and height of the ring in pixels.
  strokeWidth?: number; // Optional: the thickness of the ring's stroke.
}

/**
 * A reusable component to display a circular progress ring.
 * It's used on the dashboard to show the user's daily hydration progress.
 */
const ProgressRing: React.FC<ProgressRingProps> = ({
  progress, // The current progress percentage.
  waterRemaining, // The amount of water left to drink.
  size = 220, // Default size is 220px.
  strokeWidth = 14, // Default stroke width is 14px.
}) => {
  // --- SVG CALCULATIONS ---
  // These calculations are needed to draw the circular progress bar correctly.

  // 1. Calculate the radius of the circle.
  // We subtract the strokeWidth from the size to make sure the stroke fits inside the box.
  const radius = (size - strokeWidth) / 2;

  // 2. Calculate the circumference of the circle (the total length of its perimeter).
  // The formula is 2 * PI * radius.
  const circumference = radius * 2 * Math.PI;

  // 3. Calculate the stroke-dashoffset.
  // This is the magic part. We create a dashed line where the dash length is the
  // circumference. Then, we "offset" the start of the dash to reveal the progress.
  // A progress of 100% means the offset is 0. A progress of 0% means the offset is the full circumference.
  const offset = circumference - (progress / 100) * circumference;

  // --- RENDER LOGIC ---
  return (
    // The main container div. Its size is determined by the `size` prop.
    <div className="relative" style={{ width: size, height: size }}>
      {/* The SVG element that will contain our circles. */}
      <svg className="absolute top-0 left-0" width={size} height={size}>
         {/* Background Circle */}
         {/* This circle acts as the faint track that the progress bar fills. */}
        <circle
          stroke="hsl(var(--card))" // Use the card background color from our theme.
          fill="transparent" // Make the inside of the circle transparent.
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2} // Center the circle horizontally.
          cy={size / 2} // Center the circle vertically.
        />
        {/* Foreground Progress Circle */}
        {/* This is the actual progress indicator. */}
        <circle
          stroke="hsl(var(--primary))" // Use the primary color from our theme.
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference} // Set the dash pattern to the circle's circumference.
          strokeDashoffset={offset} // Apply the calculated offset to show progress.
          strokeLinecap="round" // Makes the end of the progress line rounded.
          r={radius}
          cx={size / 2}
          cy={size / 2}
          // Apply CSS transformations and transitions.
          style={{
            transform: 'rotate(-90deg)', // Start the progress from the top (12 o'clock).
            transformOrigin: '50% 50%', // Rotate around the center of the circle.
            // Animate the change in `stroke-dashoffset` for a smooth effect.
            transition: 'stroke-dashoffset 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
      </svg>
      
      {/* --- Central Text Content --- */}
      {/* This div sits in the middle of the ring and displays the text information. */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-500 hover:scale-105"
      >
        {/* The main percentage display. */}
        <span className="text-5xl font-bold font-headline text-primary" style={{ textShadow: '0 0 10px hsl(var(--primary) / 0.5)' }}>
          {Math.round(progress)}%
        </span>
        <span className="text-sm text-muted-foreground font-medium tracking-wider uppercase">Completed</span>
        
        {/* The remaining water amount. */}
        <div className="mt-2 text-center">
            <p className="text-lg font-semibold text-foreground">{waterRemaining}mL</p>
            <p className="text-xs text-muted-foreground">Remaining</p>
        </div>
      </div>
      
      {/* --- Inner Glow Effect --- */}
      {/* This div adds a subtle inner shadow to give the ring some depth. */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
            boxShadow: 'inset 0 0 20px hsl(var(--primary) / 0.2)',
        }}
      />
    </div>
  );
};

// Export the component so it can be used in other files.
export default ProgressRing;
