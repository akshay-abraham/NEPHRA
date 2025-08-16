// This directive marks this file as containing "Server Actions".
// Server Actions are functions that run on the server but can be called directly
// from Client Components, making it easy to handle form submissions and data mutations.
"use server";

// Import the Zod library for data validation.
import { z } from "zod";
// Import our AI flow functions.
import { hydrationRecommendations } from "@/ai/flows/hydration-recommendations";
import { getProfileInsights } from "@/ai/flows/profile-insights-flow";
// Import the Zod schemas for validation.
import { ProfileSchema, ProfileInsightsInputSchema, type ProfileInsightsOutput } from "@/ai/schemas";

/**
 * A Server Action to get a personalized hydration recommendation from the AI.
 * This function is called when the user submits their profile form.
 * @param {z.infer<typeof ProfileSchema>} data - The user's profile data from the form.
 * @returns {Promise<object | null>} The AI's recommendation or null if an error occurs.
 */
export async function getHydrationRecommendationAction(
  data: z.infer<typeof ProfileSchema>
) {
  try {
    // 1. Validate the incoming data against the ProfileSchema.
    // This ensures the data is in the correct format before we use it.
    const validatedData = ProfileSchema.parse(data);
    
    // 2. Create mock historical data.
    // In a real application, this data would be fetched from a database.
    // Here, we simulate it to provide context for the AI.
    const mockHistoricalData = JSON.stringify([
        { timestamp: '2024-07-28T08:00:00Z', amount: 250 },
        { timestamp: '2024-07-28T10:30:00Z', amount: 300 },
        { timestamp: '2024-07-28T13:00:00Z', amount: 200 },
    ]);

    // 3. Call the AI flow with the validated user data and mock history.
    const result = await hydrationRecommendations({
      ...validatedData,
      historicalData: mockHistoricalData
    });
    
    // 4. Return the result from the AI.
    return result;
  } catch (error) {
    // If any part of the process fails, log the error and return null.
    console.error("Error getting hydration recommendation:", error);
    return null;
  }
}

/**
 * A Server Action to get a personalized insight about the user's profile from the AI.
 * @param {z.infer<typeof ProfileInsightsInputSchema>} data - The user's profile and historical data.
 * @returns {Promise<ProfileInsightsOutput | null>} The AI's insight or null if an error occurs.
 */
export async function getProfileInsightsAction(
  data: z.infer<typeof ProfileInsightsInputSchema>
): Promise<ProfileInsightsOutput | null> {
  try {
    // 1. Validate the incoming data against the ProfileInsightsInputSchema.
    const validatedData = ProfileInsightsInputSchema.parse(data);
    // 2. Call the AI flow with the validated data.
    const result = await getProfileInsights(validatedData);
    // 3. Return the result.
    return result;
  } catch (error) {
    // If validation or the AI call fails, log the error and return null.
    console.error("Error getting profile insights:", error);
    return null;
  }
}
