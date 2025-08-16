// This directive marks this as a Client Component, allowing for state and user interaction.
"use client";

// --- IMPORTS ---
import { useState } from "react"; // React hook for managing component state.
import { useForm } from "react-hook-form"; // Library for managing forms easily.
import { zodResolver } from "@hookform/resolvers/zod"; // Integrates Zod with react-hook-form for validation.
import { getHydrationRecommendationAction } from "@/app/profile/actions"; // The Server Action to call our AI.
import { Button } from "@/components/ui/button"; // Custom button component.
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // Form components.
import { Input } from "@/components/ui/input"; // Custom input component.
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Custom select dropdown component.
import { Textarea } from "@/components/ui/textarea"; // Custom textarea component.
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Custom card components.
import { Wand2, Bot } from "lucide-react"; // Icons.
import type { HydrationRecommendationsOutput } from "@/ai/schemas"; // TypeScript type for the AI output.
import { ProfileSchema } from "@/ai/schemas"; // The Zod schema for validating the form data.
import type { z } from "zod";

// Define a TypeScript type for our form values based on the Zod schema.
type ProfileFormValues = z.infer<typeof ProfileSchema>;

/**
 * A component that renders the user profile form.
 * It handles user input, validation, and calls a Server Action to get AI-powered
 * hydration goal recommendations.
 */
export default function ProfileForm() {
  // --- STATE MANAGEMENT ---
  // Stores the AI's recommendation after it's been fetched. Initialized to `null`.
  const [recommendation, setRecommendation] = useState<HydrationRecommendationsOutput | null>(null);
  // Stores the loading state while the AI is processing the request.
  const [isLoading, setIsLoading] = useState(false);

  // --- FORM SETUP ---
  // `useForm` hook initializes the form with validation rules and default values.
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema), // Use our Zod schema for validation.
    // Set default values for the form fields.
    defaultValues: {
      name: "Joan Clarke",
      age: 16,
      gender: "female",
      weight: 55,
      healthConditions: ""
    },
  });

  /**
   * This function is called when the user submits the form.
   * @param {ProfileFormValues} data - The validated data from the form.
   */
  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true); // Set loading to true to disable the button.
    setRecommendation(null); // Clear any previous recommendation.
    
    // Call the Server Action with the form data.
    const result = await getHydrationRecommendationAction(data);
    
    // If the AI returns a result, update the state to display it.
    if(result) {
        setRecommendation(result);
    }
    setIsLoading(false); // Set loading back to false.
  }

  // --- RENDER LOGIC ---
  return (
    <div className="space-y-6">
      {/* The `Form` component from react-hook-form provides context to all child fields. */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* --- Personal Details Card --- */}
          <Card>
            <CardHeader>
                <CardTitle>Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Age and Weight Fields (in a grid) */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="30" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="75" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Gender Field */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            </CardContent>
          </Card>
          
           {/* --- Health Conditions Card --- */}
           <Card>
            <CardHeader>
                <CardTitle>Health & Activity</CardTitle>
                <CardDescription>
                  To create the smartest plan, our AI considers your profile (age, weight), historical drinking patterns, local temperature, and any custom notes you provide (e.g., fever, menstruation, exercise).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FormField
                    control={form.control}
                    name="healthConditions"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Textarea
                                placeholder="e.g., Currently have a slight fever."
                                className="resize-none"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
          </Card>

          {/* --- Submit Button --- */}
          <Button type="submit" className="w-full" disabled={isLoading} size="lg">
            {isLoading ? "Analyzing..." : "Save & Update AI Goal"}
            <Wand2 className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </Form>
      
      {/* --- AI Recommendation Display --- */}
      {/* This card only appears if there is a recommendation in the state. */}
      {recommendation && (
        <Card className="bg-primary/10 border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-primary" />
                    AI Hydration Plan
                </CardTitle>
                <CardDescription>
                    Based on your profile, here is your personalized plan. This will be synced to your bottle.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-center">
                <div>
                    <p className="text-3xl font-bold font-headline text-primary">{recommendation.goal_ml}</p>
                    <p className="text-sm text-muted-foreground">Daily Goal (mL)</p>
                </div>
                 <div>
                    <p className="text-3xl font-bold font-headline text-primary">{recommendation.alert_interval_minutes}</p>
                    <p className="text-sm text-muted-foreground">Alert Interval (min)</p>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
