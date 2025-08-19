/**
 * @fileOverview This file contains utility functions that are used throughout the application.
 *
 * Creating a `utils.ts` file is a common practice for organizing reusable helper functions,
 * keeping the main component files cleaner and more focused on their specific logic.
 */

// Import `clsx` for conditionally joining class names and `twMerge` for merging Tailwind CSS classes.
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function to conditionally join CSS class names together.
 * It combines the functionality of `clsx` and `tailwind-merge` to provide a robust
 * way to manage dynamic classes in components.
 *
 * Example: cn("p-4", isVisible && "block", "font-bold")
 *
 * @param {...ClassValue[]} inputs - A list of class names or conditional class names.
 * @returns {string} A single string of merged and optimized class names.
 */
export function cn(...inputs: ClassValue[]) {
  // `twMerge` intelligently merges Tailwind CSS classes, resolving conflicts.
  // `clsx` handles the conditional logic for adding classes.
  return twMerge(clsx(inputs))
}

/**
 * Calculates the user's hydration rank, their next rank, and their progress towards it.
 * This function provides the core logic for the app's gamified leveling and ranking system.
 * It makes the user's progression feel tangible and rewarding.
 * @param {number} level - The user's current level.
 * @returns {object} An object containing the current rank name, the next rank name, and the percentage progress.
 */
export function getHydrationRank(level: number): { rank: string; nextRank: string; progress: number } {
  // Define the different ranks and the level required to achieve them.
  // This structure makes it easy to add or change ranks in the future.
  const ranks = [
    { level: 1, name: "Trainee" },
    { level: 5, name: "Scout" },
    { level: 10, name: "Adept" },
    { level: 15, name: "Hydrator" },
    { level: 20, name: "Hydro-Hero" },
    { level: 25, name: "Aqua-Knight" },
    { level: 30, name: "Master" },
    { level: 40, name: "Hydration Lord" },
    { level: 50, name: "Poseidon's Chosen" }
  ];

  // Find the highest rank the user has achieved.
  let currentRank = ranks[0];
  for (const rank of ranks) {
    if (level >= rank.level) {
      currentRank = rank;
    } else {
      break; 
    }
  }

  // Find the next rank for the user.
  const currentRankIndex = ranks.findIndex(r => r.name === currentRank.name);
  const nextRank = ranks[currentRankIndex + 1];

  // If the user is at the maximum rank, their progress is 100%.
  if (!nextRank) {
    return { rank: currentRank.name, nextRank: "Max Rank", progress: 100 };
  }

  // --- PROGRESS CALCULATION ---
  // This formula calculates the user's progress percentage towards the next rank.
  // It helps visualize how close the user is to leveling up their rank.
  
  // 1. `level - currentRank.level`: How many levels the user has gained within the current rank tier.
  // 2. `nextRank.level - currentRank.level`: The total number of levels in the current rank tier.
  // 3. Divide them and multiply by 100 to get a percentage.
  const progress = ((level - currentRank.level) / (nextRank.level - currentRank.level)) * 100;

  return { rank: currentRank.name, nextRank: nextRank.name, progress };
}
