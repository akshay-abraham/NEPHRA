/**
 * @fileOverview This file serves as the entry point for the Dashboard page.
 *
 * It's a Next.js Server Component, which means it runs on the server to fetch
 * initial data before sending the page to the client. This is great for performance
 * because the user sees the content right away.
 */

// Import the client component that will handle all the interactive parts of the dashboard.
import DashboardClient from "@/app/dashboard/dashboard-client";
// Import the AI function to get the motivational message.
import { getMotivation } from "@/ai/flows/motivation-flow";
// Import the TypeScript types for the motivation data to ensure type safety.
import type { MotivationInput, MotivationOutput } from "@/ai/schemas";

/**
 * This asynchronous function fetches the initial motivational message from our AI.
 * It's called on the server when a user first visits the dashboard page.
 * It now includes error handling to prevent crashes from API rate limits.
 * @returns {Promise<MotivationOutput>} A promise that resolves to the initial motivational message.
 */
async function getInitialMotivation(): Promise<MotivationOutput> {
    try {
        // 1. Prepare the input data for the AI.
        // Since this is the first load, we'll use some default data.
        const motivationInput: MotivationInput = {
            name: "Joan Clarke",       // A default name for the user.
            streak: 5,                 // A default streak to make the message encouraging.
            progress_percentage: 0     // Progress is 0 because they just opened the app.
        };

        // 2. Call the AI function with the prepared data.
        // `await` pauses the function until the AI returns a response.
        const result = await getMotivation(motivationInput);
        
        // 3. Check if the result is valid.
        // The AI flow might return `null` if there was an error.
        if (result) {
            return result; // If successful, return the AI's message.
        }

        // If the result is null, something went wrong. We'll throw an error
        // to be caught by our `catch` block.
        throw new Error("getMotivation returned null");

    } catch (error) {
        // 4. Handle any errors that occur during the AI call.
        console.error("Error getting initial motivation:", error);

        // If there's an error (like a 429 rate limit), we'll return a friendly, 
        // default message so the user doesn't see a broken page.
        return {
            title: "Welcome Back!",
            message: "Let's get hydrated today and keep the streak alive! 💪💧"
        };
    }
}


/**
 * This is the main component for the Dashboard page.
 * Being an `async` function, it can perform asynchronous operations like fetching data.
 */
export default async function DashboardPage() {
    // 1. Fetch the initial data. This happens on the server.
    const initialMotivation = await getInitialMotivation();

    // 2. Render the client component, passing the fetched data as a prop.
    // The `DashboardClient` will then take over and handle all the interactive logic.
    return <DashboardClient initialMotivation={initialMotivation} />;
}
