import OpenAI from 'openai';
import { SUMMARY_SYSTEM_PROMPT } from './prompts';

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

export async function generateSummary(pdfText: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gemini-2.0-flash',
      messages: [
        { role: 'system', content: SUMMARY_SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Transform this documnet into an engaging, easy-to-read summary with contexually relevant emojis and proper markdown formatting: \n\n ${pdfText}`,
        },
      ],
      temperature: 0.7,
    });

    return response.choices[0]?.message.content;
  } catch (err: any) {
    if (err?.status === 429) {
      throw new Error('Rate limit exceeded');
    }
    throw err;
  }
}
