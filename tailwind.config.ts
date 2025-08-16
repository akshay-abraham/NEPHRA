// Import the `Config` type from Tailwind CSS for type safety.
import type {Config} from 'tailwindcss';

// This is the main configuration object for Tailwind CSS.
export default {
  // `darkMode: ['class']` enables dark mode based on a class on the `<html>` tag.
  darkMode: ['class'],
  
  // `content` tells Tailwind where to look for class names in your project files.
  // It scans these files to generate only the necessary CSS, keeping the file size small.
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  // The `theme` object is where you customize Tailwind's default design system.
  theme: {
    // `extend` allows you to add new values to the theme without overwriting the defaults.
    extend: {
      // Custom font families for consistent typography.
      fontFamily: {
        body: ['Roboto', 'sans-serif'], // For all main body text.
        headline: ['Montserrat', 'sans-serif'], // For headings and important text.
        code: ['monospace'], // For code snippets.
      },
      
      // Custom color palette using CSS variables defined in `globals.css`.
      // This makes the theme easily configurable and consistent.
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      
      // Custom border radius values, based on the `--radius` CSS variable.
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      
      // Custom keyframe animations for things like accordions.
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      
      // Assigning the keyframes to animation utility classes.
      animation: {
        'accordion-down': 'accordion-down 0.3s ease-out',
        'accordion-up': 'accordion-up 0.3s ease-out',
      },
    },
  },
  
  // `plugins` allow you to add extra functionality to Tailwind, like new utility classes.
  // `tailwindcss-animate` adds classes for enter/exit animations.
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
