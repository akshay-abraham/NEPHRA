/**
 * @fileOverview This file contains mock data for the application.
 *
 * In a real-world application, this data would be fetched from a database.
 * For this demo, we are defining it statically to simulate a live environment.
 * This includes data for the leaderboard, user achievements, and icons.
 */

// Import all the icons we'll need for achievements from the lucide-react library.
import { Award, Shield, Target, Calendar, Sparkles, Trophy, Droplet, Clock, Wind, Zap, Mountain, Star, Moon, Sun, Heart, Coffee, Anchor, GitCommit, Bot, Gift, Gem, ShieldCheck, Sword } from "lucide-react";

/**
 * Mock data for the leaderboard.
 * Each object represents a user with their rank, name, score, avatar placeholder, streak, and level.
 * It includes famous computer scientists and some fun Easter eggs!
 */
export const leaderboardData = [
  { id: 1, rank: 1, name: "Joan Clarke", drops: 13500, avatar: "woman thinking", streak: 42, level: 28 },
  { id: 2, rank: 2, name: "Alan Turing", drops: 12800, avatar: "man with glasses", streak: 35, level: 26 },
  { id: 3, rank: 3, name: "Grace Hopper", drops: 12000, avatar: "woman in navy uniform", streak: 30, level: 24 },
  { id: 4, rank: 4, name: "David J. Malan", drops: 11500, avatar: "man teaching computer science", streak: 28, level: 23 },
  { id: 5, rank: 5, name: "Ada Lovelace", drops: 11200, avatar: "victorian woman writing", streak: 25, level: 22 },
  { id: 6, rank: 6, name: "Duo", drops: 10800, avatar: "green owl mascot", streak: 200, level: 21 },
  { id: 7, rank: 7, name: "Steve", drops: 10500, avatar: "blocky character mining", streak: 18, level: 20 },
  { id: 8, rank: 8, name: "Rubber Ducky", drops: 10100, avatar: "rubber duck with code", streak: 15, level: 19 },
  { id: 9, rank: 9, name: "Donald Knuth", drops: 9800, avatar: "man with organ pipes", streak: 12, level: 18 },
  { id: 10, rank: 10, name: "Margaret Hamilton", drops: 9500, avatar: "woman with stack of books", streak: 10, level: 17 },
];

/**
 * A comprehensive list of all possible achievements in the app.
 * Each achievement has an ID, icon, title, and description.
 */
const allAchievementsList = [
    // Progress-based achievements
    { id: 1, icon: Droplet, title: "First Sip", description: "Log your first drink." },
    { id: 2, icon: Award, title: "Half-Litre Hero", description: "Drink 500 mL in a day." },
    { id: 3, icon: Target, title: "Daily Goal Crusher", description: "Hit your daily target once." },
    { id: 4, icon: Star, title: "Hydration Rookie", description: "Drink 10 L total." },
    { id: 5, icon: Trophy, title: "H2O Pro", description: "Drink 100 L total." },
    { id: 6, icon: Shield, title: "Liquid Legend", description: "Drink 500 L total." },
    { id: 7, icon: Gem, title: "HydraMaster", description: "Drink 1000 L total." },
    // Consistency-based achievements
    { id: 8, icon: Calendar, title: "3-Day Streaker", description: "Hit your daily target 3 days in a row." },
    { id: 9, icon: Calendar, title: "Weekly Winner", description: "Hit daily target for 7 consecutive days." },
    { id: 10, icon: Calendar, title: "Month of Flow", description: "30 days without missing a goal." },
    { id: 11, icon: Anchor, title: "Iron Will", description: "90-day streak." },
    { id: 12, icon: GitCommit, title: "365 Days of Clarity", description: "1 year without missing a day." },
    // Skill-based achievements
    { id: 13, icon: Zap, title: "Perfect Pour", description: "Hit your goal exactly, no more no less." },
    { id: 14, icon: Clock, title: "Right on Time", description: "Meet all timed drinking reminders for a day." },
    { id: 15, icon: Wind, title: "Speed Sipper", description: "Log 200 mL within 60 seconds of a reminder." },
    { id: 16, icon: Heart, title: "Even Flow", description: "Keep each drinking session evenly distributed." },
    { id: 17, icon: Bot, title: "Adaptive Athlete", description: "Adjust goal and meet it perfectly 3 days." },
    // Special Event achievements
    { id: 18, icon: Sun, title: "Summer Survivor", description: "Meet goal every day in a heatwave week." },
    { id: 19, icon: Mountain, title: "Winter Warrior", description: "Stay hydrated for 14 days in winter." },
    { id: 20, icon: Gift, title: "Festival Flow", description: "Log water during a major festival day." },
    { id: 21, icon: Sword, title: "Boss Battle Victor", description: "Complete a high-goal challenge event." },
    { id: 22, icon: Trophy, title: "Hydration Marathoner", description: "Log every drink in a 24-hour event." },
    // Secret / Fun achievements
    { id: 23, icon: Moon, title: "Midnight Mirage", description: "Log a drink between 12:00 AM and 3:00 AM." },
    { id: 24, icon: ShieldCheck, title: "Double Hydra", description: "Drink double your daily goal." },
    { id: 25, icon: Droplet, title: "One-Sip Wonder", description: "Log 500 mL in a single sip." },
    { id: 26, icon: Sparkles, title: "Quantum Sip", description: "Log 42 mL. The answer to everything." },
    { id: 27, icon: Zap, title: "Dehydration Slayer", description: "Return after a 7-day break and crush your goal." },
    { id: 28, icon: Coffee, title: "Bottle Buddy", description: "Sync with a friend and both meet goals." },
];

/**
 * A record of all achievements for each user.
 * 
 * In a real application, this data would come from a database. For this demo,
 * we are generating it programmatically. 
 * 
 * To fix a hydration error (where server and client render different HTML), we have
 * replaced `Math.random()` with a deterministic check. This ensures that the generated
 * achievement data is the same on both the server and the client, preventing a mismatch.
 * The logic uses the user's ID and the achievement's ID to decide if an achievement is unlocked.
 */
export const allAchievements = leaderboardData.reduce((acc, user) => {
    // For each user, we map over the master list of achievements.
    acc[user.id] = allAchievementsList.map(ach => ({
        ...ach, // Copy all properties from the original achievement.
        // Determine if the achievement is unlocked using a consistent, non-random formula.
        // The modulo operator (%) gives us a predictable pattern.
        achieved: (ach.id * 3 + user.id * 5) % 10 > 3
    }));
    return acc; // Return the accumulator for the next iteration.
}, {} as Record<number, typeof allAchievementsList>); // The initial value is an empty object.
