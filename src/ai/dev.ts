
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-subtasks.ts';
import '@/ai/flows/suggest-goals-flow.ts';
import '@/ai/flows/generate-steps-for-subtask.ts';
