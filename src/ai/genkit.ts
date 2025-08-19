/**
 * @fileOverview This file is the central configuration for Genkit in our application.
 *
 * It initializes the Genkit library, sets up the necessary plugins (like the one
 * for Google AI), and specifies the default AI model to be used across all flows.
 * This centralized setup makes it easy to manage our AI connections.
 */

// Import the `genkit` library, which is the core of the framework.
import {genkit} from 'genkit';
// Import the Google AI plugin, which allows Genkit to connect to Google's AI models (like Gemini).
import {googleAI} from '@genkit-ai/googleai';

// Initialize Genkit and export the configured `ai` object.
// This `ai` object will be used throughout the app to define and call AI flows.
export const ai = genkit({
  // A list of plugins to use. We are enabling the Google AI plugin.
  plugins: [googleAI()],
  // Specify the default model to use for AI generation tasks.
  // We are using 'gemini-2.0-flash', a fast and capable model.
  model: 'googleai/gemini-2.0-flash',
});
