import { config } from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

// Dot env config
config();

// Configure Open AI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Export Open AI
export const openai = new OpenAIApi(configuration);
