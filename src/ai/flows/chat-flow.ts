'use server';
/**
 * @fileOverview Conversational AI flow for TaskWise assistant.
 *
 * - chatWithAssistant - A function to send a message to the AI assistant and get a response.
 * - ChatWithAssistantInput - The input type for the chatWithAssistant function.
 * - ChatWithAssistantOutput - The return type for the chatWithAssistant function.
 * - GeminiMessage - Type for structuring messages for the Gemini model.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { generateSubtasksTool } from '@/ai/tools/task-tools';

// Gemini specific type for message history parts and messages
const GeminiMessagePartSchema = z.object({ text: z.string().optional(), toolResponse: z.any().optional() });
const GeminiMessageSchema = z.object({
  role: z.enum(['user', 'model', 'tool']),
  parts: z.array(GeminiMessagePartSchema),
});
export type GeminiMessage = z.infer<typeof GeminiMessageSchema>;

export const ChatWithAssistantInputSchema = z.object({
  message: z.string().describe('The latest message from the user.'),
  history: z.array(GeminiMessageSchema).optional().describe('The conversation history.'),
});
export type ChatWithAssistantInput = z.infer<typeof ChatWithAssistantInputSchema>;

export const ChatWithAssistantOutputSchema = z.object({
  response: z.string().describe('The AI assistant\'s response.'),
});
export type ChatWithAssistantOutput = z.infer<typeof ChatWithAssistantOutputSchema>;

export async function chatWithAssistant(input: ChatWithAssistantInput): Promise<ChatWithAssistantOutput> {
  return chatWithAssistantFlow(input);
}

const chatWithAssistantFlow = ai.defineFlow(
  {
    name: 'chatWithAssistantFlow',
    inputSchema: ChatWithAssistantInputSchema,
    outputSchema: ChatWithAssistantOutputSchema,
  },
  async (input) => {
    const systemInstruction = `You are TaskWise AI Assistant. 
Your primary functions are:
1.  **Goal Breakdown**: If a user provides a goal and asks you to break it down or plan it, use the 'generateSubtasksTool' to create actionable subtasks. After the tool provides the subtasks, present them clearly to the user in a readable format (e.g., a bulleted list).
2.  **Deadline Reminders**: You can discuss deadlines if users provide task and deadline information. You do not have direct access to their saved data or calendar.
3.  **App Guidance**: Answer questions about using the TaskWise application (e.g., "How do I save a task?", "Where can I see my goals?").
4.  **General Conversation**: Engage in polite, helpful conversation about productivity, task management, and goals.

**Important Guidelines:**
*   Be Concise: Provide clear, to-the-point answers.
*   Be Friendly and Encouraging.
*   Acknowledge Limitations: If you can't fulfill a request (e.g., access specific saved data like their calendar or task list), explain politely. For instance, "I can't access your saved tasks directly, but I can help you break down a new goal if you tell me about it."
*   Contextual Responses: Use conversation history for context.
*   Format for Readability: When listing subtasks or steps, use bullet points or numbered lists.

Do not invent features the app doesn't have. When breaking down a goal, explicitly use the generateSubtasksTool.
If the user asks a general question or for app guidance, respond directly.
`;

    const messages: GeminiMessage[] = [];
    if (input.history) {
      messages.push(...input.history);
    }
    messages.push({ role: 'user', parts: [{ text: input.message }] });

    const result = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      prompt: {
        system: systemInstruction,
        messages: messages,
      },
      tools: [generateSubtasksTool],
      config: {
        // temperature: 0.7, 
      },
    });

    const responseText = result.text;

    if (!responseText) {
      console.warn("Chatbot AI returned no text response. Full output:", result.output);
      // Check if a tool was called but didn't lead to a text response, which might be unexpected.
      if (result.toolRequests && result.toolRequests.length > 0) {
        return { response: "I've processed your request using a tool, but I'm having trouble summarizing the result. Could you try rephrasing?" };
      }
      return { response: "I'm sorry, I encountered an issue processing your request. Please try rephrasing or try again later." };
    }

    return { response: responseText };
  }
);
