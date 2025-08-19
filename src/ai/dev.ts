/**
 * @fileOverview This is the development entry point for our Genkit AI flows.
 *
 * This file is used by the `genkit:dev` script to start the Genkit development server.
 * It imports all the AI flow files, which registers them with Genkit so they can be
 * tested and used in the application during development.
 */

// Import the `config` function from the `dotenv` package.
// This allows us to load environment variables from a .env file into process.env.
import { config } from 'dotenv';

// Execute the config function to load the variables.
config();

// Import the AI flows. When these files are imported, the flows defined within them
// are automatically registered with the Genkit framework.
import '@/ai/flows/hydration-recommendations.ts'; // For personalized hydration goals.
import '@/ai/flows/motivation-flow.ts';           // For generating motivational messages.
import '@/ai/flows/profile-insights-flow.ts';    // For generating user profile insights.
