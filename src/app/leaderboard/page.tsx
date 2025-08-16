/**
 * @fileOverview This file defines the Leaderboard page.
 *
 * It displays a ranked list of the top users based on their in-game "drops" currency.
 * This component is a Server Component, so it's rendered on the server.
 */

// Import UI components for building the table and user avatars.
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Import icons from the lucide-react library.
import { Crown, Trophy, Droplets, Star } from "lucide-react";
// Import the mock data for the leaderboard. In a real app, this would come from a database.
import { leaderboardData } from "@/lib/leaderboard-data";
// Import a utility function to combine CSS classes.
import { cn } from "@/lib/utils";

/**
 * The main component for the Leaderboard page.
 * @returns {JSX.Element} A page displaying the user leaderboard.
 */
export default function LeaderboardPage() {
    return (
        <div className="p-4 space-y-4">
            {/* --- Page Header --- */}
            <header className="mb-6 text-center">
                <Trophy className="h-10 w-10 text-primary mx-auto mb-2"/>
                <h1 className="text-2xl font-headline font-bold">Global Leaderboard</h1>
                <p className="text-muted-foreground">See how you stack up against other hydro-heroes!</p>
            </header>

            {/* --- Leaderboard Table --- */}
            <Table>
                {/* Table Header */}
                <TableHeader>
                    <TableRow className="border-b-0">
                        <TableHead className="w-12 text-center">Rank</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead className="text-right">Drops</TableHead>
                    </TableRow>
                </TableHeader>
                {/* Table Body */}
                <TableBody>
                    {/* We `map` over the `leaderboardData` array to create a row for each user. */}
                    {leaderboardData.map((user, index) => (
                        <TableRow key={user.id} className={cn(
                            "border-0",
                            // Add a special background style for the top 3 users to make them stand out.
                            index < 3 && "bg-primary/5"
                        )}>
                            {/* Rank Cell */}
                            <TableCell className="font-bold text-xl text-center text-muted-foreground w-12">
                                {/* Display a crown icon for the #1 ranked user. */}
                                {user.rank === 1 ? <Crown className="h-7 w-7 text-yellow-400 mx-auto"/> : user.rank}
                            </TableCell>
                            {/* User Cell */}
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    {/* User Avatar */}
                                    <Avatar className="h-10 w-10 ring-2 ring-primary/50">
                                        {/* Display the user's avatar image. */}
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        {/* If the image fails to load, show the first letter of their name. */}
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    {/* User Name and Level */}
                                    <div>
                                        <p className="font-semibold">{user.name}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500" /> Lvl {user.level}</span>
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            {/* Drops Cell */}
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2 text-primary font-bold text-lg">
                                    <Droplets className="h-5 w-5" />
                                    {/* Format the number with commas (e.g., 12,500). */}
                                    <span>{user.drops.toLocaleString()}</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
