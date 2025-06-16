'use server';
/**
 * @fileOverview Generates a tailored resume based on a job description and an existing resume.
 *
 * - generateTailoredResume - A function that generates a resume.
 * - GenerateTailoredResumeInput - The input type for the generateTailoredResume function.
 * - GenerateTailoredResumeOutput - The return type for the generateTailoredResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTailoredResumeInputSchema = z.object({
  jobDescription: z.string().describe('The full text of the job description.'),
  currentResume: z.string().describe('The full text of the user\'s current resume.'),
});
export type GenerateTailoredResumeInput = z.infer<typeof GenerateTailoredResumeInputSchema>;

const GenerateTailoredResumeOutputSchema = z.object({
  tailoredResume: z.string().describe('The AI-generated resume, tailored to the job description, ready to copy and paste.'),
  reasoning: z.string().describe('A brief explanation of the key changes made to the resume and why.'),
});
export type GenerateTailoredResumeOutput = z.infer<typeof GenerateTailoredResumeOutputSchema>;

export async function generateTailoredResume(input: GenerateTailoredResumeInput): Promise<GenerateTailoredResumeOutput> {
  return generateTailoredResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTailoredResumePrompt',
  input: {schema: GenerateTailoredResumeInputSchema},
  output: {schema: GenerateTailoredResumeOutputSchema},
  prompt: `You are an expert resume writer and career coach. Your task is to revise and tailor the provided resume to perfectly match the given job description.

Analyze the job description carefully, identifying key skills, experiences, and qualifications sought by the employer.
Then, review the current resume and rewrite it to highlight the most relevant aspects, using strong action verbs and quantifiable achievements where possible.
The output should be a complete, ready-to-use resume text that the user can copy and paste.

Also provide a brief reasoning for the main changes you made or how you tailored the resume.

Job Description:
{{{jobDescription}}}

Current Resume:
{{{currentResume}}}

Generate a tailored resume based on the above.
`,
});

const generateTailoredResumeFlow = ai.defineFlow(
  {
    name: 'generateTailoredResumeFlow',
    inputSchema: GenerateTailoredResumeInputSchema,
    outputSchema: GenerateTailoredResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
