import { Configuration, OpenAIApi } from 'openai';

// Configure Open AI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Export Open AI
export const openai = new OpenAIApi(configuration);
