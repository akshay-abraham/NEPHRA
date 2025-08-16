'use server';
/**
 * @fileOverview This file defines an AI-powered flow for generating personalized user insights.
 *
 * It uses Genkit to create a helpful and friendly AI hydration coach that analyzes a user's
 * hydration history and profile to provide a single, actionable tip to help them improve.
 */

// Import the global AI configuration from our Genkit setup file.
import {ai} from '@/ai/genkit';
// Import the Zod schemas that define the expected input and output data structures.
import { ProfileInsightsInputSchema, ProfileInsightsOutputSchema, type ProfileInsightsInput, type ProfileInsightsOutput } from '@/ai/schemas';

/**
 * This is the main function that other parts of the app will call to get a profile insight.
 * @param {ProfileInsightsInput} input - The user's profile and historical data.
 * @returns {Promise<ProfileInsightsOutput>} A promise that resolves to the AI-generated insight.
 */
export async function getProfileInsights(input: ProfileInsightsInput): Promise<ProfileInsightsOutput> {
  // We call the Genkit flow with the provided input.
  return profileInsightsFlow(input);
}

// Define the prompt that will be sent to the AI model.
const profileInsightsPrompt = ai.definePrompt({
  name: 'profileInsightsPrompt', // A unique name for this prompt.
  input: {schema: ProfileInsightsInputSchema}, // The expected input data format.
  output: {schema: ProfileInsightsOutputSchema}, // The expected output data format.
  
  // The core prompt text. We set the persona and give clear instructions for the AI.
  prompt: `You are a helpful and friendly AI hydration coach. Your goal is to provide a single, actionable, and personalized tip to the user to help them improve their hydration habits.

User's Name: {{{name}}}
User's Level: {{{level}}}
Hydration Rank: {{{hydrationRank}}}
Health Conditions: {{#if healthConditions}} {{{healthConditions}}} {{else}} None reported {{/if}}

Analyze their historical hydration data to find a pattern. The data is a JSON string of drinking events.
Historical Data: {{{historicalData}}}

Based on this data, provide one insightful tip. For example:
- If they drink a lot in the morning but little in the afternoon, suggest an afternoon reminder.
- If they consistently miss their goal by a small amount, suggest a specific small increase.
- If they report a health condition, gently tie the advice to it.
- Keep the tone positive and encouraging. Address the user by name.
`,
  // Configuration for the AI model, including safety settings.
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
    ],
  },
});

// Define the Genkit flow.
const profileInsightsFlow = ai.defineFlow(
  {
    name: 'profileInsightsFlow', // A unique name for this flow.
    inputSchema: ProfileInsightsInputSchema, // The data this flow expects.
    outputSchema: ProfileInsightsOutputSchema, // The data this flow will return.
  },
  async input => {
    // 1. Call the AI prompt with the user's profile and history.
    const {output} = await profileInsightsPrompt(input);
    // 2. Return the structured output from the AI.
    return output!;
  }
);
