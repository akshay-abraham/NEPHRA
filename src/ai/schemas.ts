/**
 * @fileOverview This file defines the data structures (schemas) for our application's AI flows.
 *
 * We use the Zod library to create schemas. Zod allows us to define the shape of our data,
 * including data types (string, number, etc.) and descriptions. This ensures that the data
 * flowing into and out of our AI models is always correctly formatted, which prevents errors.
 */

// Import the Zod library, which we alias as 'z'.
import { z } from "zod";

// --- Schemas for hydration-recommendations.ts ---

// This schema defines the input data needed for the hydration recommendations flow.
export const HydrationRecommendationsInputSchema = z.object({
  age: z.number().describe('The age of the user in years.'),
  gender: z.string().describe('The gender of the user (e.g., male, female, other).'),
  weight: z.number().describe('The weight of the user in kilograms.'),
  historicalData: z.string().describe('Historical hydration data in JSON format, including timestamps and amounts.'),
  healthConditions: z.string().optional().describe('Optional free-text field for health conditions that might affect hydration needs (e.g., fever, diabetes, menstruation).'),
});
// This creates a TypeScript type from the schema for use in our code.
export type HydrationRecommendationsInput = z.infer<typeof HydrationRecommendationsInputSchema>;

// This schema defines the output data we expect from the hydration recommendations flow.
export const HydrationRecommendationsOutputSchema = z.object({
  goal_ml: z.number().describe('The recommended daily hydration goal in milliliters.'),
  alert_interval_minutes: z.number().describe('The recommended alert interval in minutes.'),
});
// Creates a TypeScript type for the output.
export type HydrationRecommendationsOutput = z.infer<typeof HydrationRecommendationsOutputSchema>;

// --- Schemas for motivation-flow.ts ---

// Defines the input for the motivational message flow.
export const MotivationInputSchema = z.object({
  name: z.string().describe("The user's name."),
  streak: z.number().describe('The current daily streak of meeting hydration goals.'),
  progress_percentage: z.number().describe('The percentage of the daily hydration goal completed.'),
});
export type MotivationInput = z.infer<typeof MotivationInputSchema>;

// Defines the output for the motivational message flow.
export const MotivationOutputSchema = z.object({
  message: z.string().describe('A short, witty, and encouraging message for the user. Like something Duolingo would say. It should be 1-2 sentences.'),
  title: z.string().describe("A short, encouraging title for the message. E.g., 'Great start!' or 'Keep it up!'.")
});
export type MotivationOutput = z.infer<typeof MotivationOutputSchema>;

// --- Schemas for profile-insights-flow.ts ---

// Defines the input for the profile insights flow.
export const ProfileInsightsInputSchema = z.object({
    name: z.string().describe("The user's name."),
    level: z.number().describe("The user's current level."),
    hydrationRank: z.string().describe("The user's current hydration rank (e.g., 'Scout', 'Hydro-Hero')."),
    historicalData: z.string().describe('A JSON string of historical hydration data.'),
    healthConditions: z.string().optional().describe('Any health conditions the user has reported.'),
});
export type ProfileInsightsInput = z.infer<typeof ProfileInsightsInputSchema>;

// Defines the output for the profile insights flow.
export const ProfileInsightsOutputSchema = z.object({
    insight: z.string().describe("A personalized insight or tip for the user based on their hydration patterns. For example, 'You're great at hydrating in the morning, but tend to forget in the afternoon. Try setting a reminder!'"),
});
export type ProfileInsightsOutput = z.infer<typeof ProfileInsightsOutputSchema>;


// --- Schema for the user profile form ---

// This schema defines the data structure for the form where users can edit their profile.
export const ProfileSchema = z.object({
  name: z.string(),
  age: z.number(),
  gender: z.string(),
  weight: z.number(),
  healthConditions: z.string().optional(),
});
