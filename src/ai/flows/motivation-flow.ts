'use server';
/**
 * @fileOverview This file defines an AI-powered flow for generating motivational messages.
 *
 * It uses Genkit to create a fun, witty, and sassy AI coach (like Duolingo)
 * that provides users with short, encouraging messages based on their daily
 * hydration progress and streak.
 */

// Import the global AI configuration from our Genkit setup file.
import {ai} from '@/ai/genkit';
// Import the Zod schemas that define the expected input and output data structures.
import { MotivationInputSchema, MotivationOutputSchema, type MotivationInput, type MotivationOutput } from '@/ai/schemas';

/**
 * This is the main function that other parts of the app will call to get a motivational message.
 * @param {MotivationInput} input - The user's progress data (name, streak, percentage).
 * @returns {Promise<MotivationOutput>} A promise that resolves to the AI-generated message and title.
 */
export async function getMotivation(input: MotivationInput): Promise<MotivationOutput> {
  // We call the Genkit flow with the provided input.
  return motivationFlow(input);
}

// Define the prompt that will be sent to the AI model.
const motivationPrompt = ai.definePrompt({
  name: 'motivationPrompt', // A unique name for this prompt.
  input: {schema: MotivationInputSchema}, // The expected input data format.
  output: {schema: MotivationOutputSchema}, // The expected output data format.
  
  // The core prompt text. We set the persona and give instructions based on user progress.
  prompt: `You are a fun, witty, and slightly sassy AI coach for a smart water bottle app, like Duolingo but for hydration. Your goal is to motivate users to drink more water.

User's Name: {{{name}}}
Current Streak: {{{streak}}} days
Today's Progress: {{{progress_percentage}}}%

Generate a short, motivational message and a title based on their progress.
- If progress is 0, give them a kick-off message to start the day.
- If progress is low (1-40%), be encouraging.
- If progress is good (41-99%), be excited and push them to finish.
- If progress is 100% or more, be celebratory.
- Mention their streak if it's greater than 0 to encourage them to keep it.
- Keep the tone light, fun, and use emojis!
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
const motivationFlow = ai.defineFlow(
  {
    name: 'motivationFlow', // A unique name for this flow.
    inputSchema: MotivationInputSchema, // The data this flow expects.
    outputSchema: MotivationOutputSchema, // The data this flow will return.
  },
  async input => {
    // 1. Call the AI prompt with the user's progress data.
    const {output} = await motivationPrompt(input);
    // 2. Return the structured output from the AI.
    return output!;
  }
);
