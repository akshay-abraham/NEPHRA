/**
 * @fileOverview This file defines the dynamic user profile page.
 *
 * It uses a dynamic route `[id]` to display the profile for a specific user
 * based on the ID in the URL (e.g., `/profile/1`).
 */

// Import `notFound` from Next.js to handle cases where the user ID doesn't exist.
import { notFound } from "next/navigation";
// Import the mock data for users and their achievements.
import { leaderboardData, allAchievements } from "@/lib/leaderboard-data";
// Import the utility function to calculate the user's rank.
import { getHydrationRank } from "@/lib/utils";
// Import UI components.
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
// Import icons.
import { Flame, Star, Droplets, Sword } from "lucide-react";

/**
 * This is the main component for the user profile page.
 * @param {object} props - The properties passed to the component.
 * @param {object} props.params - An object containing the dynamic route parameters.
 * @param {string} props.params.id - The user ID from the URL.
 * @returns {JSX.Element} A page displaying a specific user's profile.
 */
export default function UserProfilePage({ params }: { params: { id: string } }) {
    // 1. Find the user in our data whose ID matches the one from the URL.
    // We use `parseInt` to convert the ID from a string to a number for the comparison.
    const user = leaderboardData.find(u => u.id === parseInt(params.id));

    // 2. If no user is found, display the 404 "Not Found" page.
    if (!user) {
        notFound();
    }

    // 3. Get the achievements for this specific user.
    // If the user has no achievements, default to an empty array.
    const userAchievements = allAchievements[user.id] || [];
    
    // 4. Calculate the user's current rank based on their level.
    const hydrationRank = getHydrationRank(user.level);

    // 5. Render the user's profile information.
    return (
        <div className="p-4 space-y-6">
            {/* --- Profile Header --- */}
            <header className="flex flex-col items-center text-center space-y-3 pt-4">
                <Avatar className="w-24 h-24 ring-4 ring-primary/50">
                    {/* Use a placeholder image, but provide a hint for AI image generation tools. */}
                    <AvatarImage src={`https://placehold.co/128x128.png`} alt={user.name} data-ai-hint={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-headline font-bold">{user.name}</h1>
                {/* Display the user's rank in a styled badge. */}
                <div className="flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    <Sword className="h-4 w-4" />
                    <span>{hydrationRank.rank}</span>
                </div>
            </header>

            {/* --- Core Stats Card --- */}
            <Card className="bg-gradient-to-br from-primary/10 to-card">
                <CardContent className="p-4 grid grid-cols-3 text-center divide-x divide-primary/20">
                    {/* Level */}
                    <div className="flex flex-col items-center">
                        <Star className="h-6 w-6 text-yellow-500 mb-1" />
                        <p className="text-xl font-bold">{user.level}</p>
                        <p className="text-xs text-muted-foreground">Level</p>
                    </div>
                    {/* Streak */}
                    <div className="flex flex-col items-center">
                        <Flame className="h-6 w-6 text-orange-500 mb-1" />
                        <p className="text-xl font-bold">{user.streak}</p>
                        <p className="text-xs text-muted-foreground">Streak</p>
                    </div>
                    {/* Drops */}
                    <div className="flex flex-col items-center">
                        <Droplets className="h-6 w-6 text-primary mb-1" />
                        <p className="text-xl font-bold">{user.drops.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Drops</p>
                    </div>
                </CardContent>
            </Card>

            {/* --- Achievements Section --- */}
            <div>
              <h2 className="text-xl font-headline font-bold text-center mb-4">Achievements</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {/* Map over the user's achievements to display each one. */}
                  {userAchievements.map((ach, i) => (
                      <Card key={i} className={`text-center transition-all duration-300 ${ach.achieved ? 'border-primary/50 bg-primary/10' : 'bg-card'}`}>
                          <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                              <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-3 ${ach.achieved ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                {/* Display the icon for the achievement. */}
                                <ach.icon className={`h-8 w-8 ${ach.achieved ? '' : 'text-muted-foreground'}`}/>
                              </div>
                              <p className="font-semibold text-sm">{ach.title}</p>
                              <p className="text-xs text-muted-foreground">{ach.description}</p>
                          </CardContent>
                      </Card>
                  ))}
                  {/* If the user has no achievements, display a message. */}
                  {userAchievements.length === 0 && <p className="col-span-full text-center text-muted-foreground">No achievements yet!</p>}
              </div>
            </div>
        </div>
    )
}
