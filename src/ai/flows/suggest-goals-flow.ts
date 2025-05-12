'use server';
/**
 * @fileOverview Generates creative, diverse, and achievable personal or professional goals.
 *
 * - suggestGoals - A function that suggests 5 goals.
 * - SuggestGoalsOutput - The return type for the suggestGoals function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// No input schema needed for this simple case

const SuggestGoalsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of 5 suggested goals, each as a single sentence.'),
});
export type SuggestGoalsOutput = z.infer<typeof SuggestGoalsOutputSchema>;

export async function suggestGoals(): Promise<SuggestGoalsOutput> {
  return suggestGoalsFlow({}); // Pass empty object as flow expects input, even if schema is empty
}

const prompt = ai.definePrompt({
  name: 'suggestGoalsPrompt',
  // No input schema needed for prompt if flow doesn't pass specific input fields
  output: {schema: SuggestGoalsOutputSchema},
  prompt: `You are an AI assistant designed to help users set personal or professional goals.
Generate 5 creative, diverse, and achievable goals.
Each goal must be a single sentence.
Present the goals as a list of strings. Ensure the output is a valid JSON matching the provided schema.
`,
});

const suggestGoalsFlow = ai.defineFlow(
  {
    name: 'suggestGoalsFlow',
    inputSchema: z.object({}), // Empty input schema
    outputSchema: SuggestGoalsOutputSchema,
  },
  async () => { // Input parameter can be omitted or typed as {}
    const {output} = await prompt({}); // Call prompt with empty object
    return output!;
  }
);
