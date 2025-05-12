
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-subtasks.ts';
import '@/ai/flows/suggest-goals-flow.ts';
import '@/ai/flows/generate-steps-for-subtask.ts';
import '@/ai/flows/chat-flow.ts'; // ADDED
import '@/ai/tools/task-tools.ts'; // ADDED

