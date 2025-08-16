'use server';
/**
 * @fileOverview This file defines an AI-powered flow for generating personalized hydration recommendations.
 *
 * It uses Genkit to create a flow that takes a user's profile and health data as input
 * and returns a recommended daily water intake goal and a suggested alert interval.
 * This allows the app to provide smart, tailored advice to each user.
 */

// Import the global AI configuration from our Genkit setup file.
import {ai} from '@/ai/genkit';
// Import the Zod schemas that define the expected input and output data structures for this flow.
import { HydrationRecommendationsInputSchema, HydrationRecommendationsOutputSchema, type HydrationRecommendationsInput, type HydrationRecommendationsOutput } from '@/ai/schemas';

/**
 * This is the main function that other parts of the app will call to get hydration recommendations.
 * It's an exported, async function that takes user data and returns the AI's recommendation.
 * @param {HydrationRecommendationsInput} input - The user's data (age, weight, etc.).
 * @returns {Promise<HydrationRecommendationsOutput>} A promise that resolves to the AI's recommendation.
 */
export async function hydrationRecommendations(input: HydrationRecommendationsInput): Promise<HydrationRecommendationsOutput> {
  // Inside, we call the Genkit flow with the provided input.
  return hydrationRecommendationsFlow(input);
}

// Define the prompt that will be sent to the AI model.
// A prompt is a set of instructions and data that guides the AI's response.
const hydrationRecommendationsPrompt = ai.definePrompt({
  name: 'hydrationRecommendationsPrompt', // A unique name for this prompt.
  input: {schema: HydrationRecommendationsInputSchema}, // The expected input data format.
  output: {schema: HydrationRecommendationsOutputSchema}, // The expected output data format.
  
  // The core prompt text. We use Handlebars syntax `{{{...}}}` to insert user data.
  prompt: `You are an AI assistant that provides personalized hydration recommendations based on user data.

  Analyze the following user profile and historical hydration data to determine the optimal daily hydration goal and alert intervals.

  User Profile:
  - Age: {{{age}}}
  - Gender: {{{gender}}}
  - Weight: {{{weight}}} kg
  {{#if healthConditions}}
  - Health Conditions: {{{healthConditions}}}
  {{/if}}

  Historical Hydration Data:
  {{{historicalData}}}

  Provide the optimal daily hydration goal in milliliters and alert interval in minutes.
  Consider factors such as activity level, climate, health conditions, and individual preferences when making your recommendations.
  For example, someone with a fever, who is menstruating, or has diabetes may need more water.

  Ensure that the suggested hydration goals are realistic and achievable for the user.
  `,
  // Configuration for the AI model, including safety settings to prevent harmful content.
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
    ],
  },
});

// Define the Genkit flow. A flow is a function that orchestrates AI calls and other logic.
const hydrationRecommendationsFlow = ai.defineFlow(
  {
    name: 'hydrationRecommendationsFlow', // A unique name for this flow.
    inputSchema: HydrationRecommendationsInputSchema, // The data format this flow expects.
    outputSchema: HydrationRecommendationsOutputSchema, // The data format this flow will return.
  },
  async input => {
    // 1. Call the AI prompt with the user's input data.
    const {output} = await hydrationRecommendationsPrompt(input);
    // 2. Return the structured output from the AI. The '!' tells TypeScript we're sure it won't be null.
    return output!;
  }
);
