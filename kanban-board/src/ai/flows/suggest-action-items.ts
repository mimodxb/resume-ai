'use server';

/**
 * @fileOverview Suggests action items for a job application based on its status and details.
 *
 * - suggestActionItems - A function that suggests action items for a job application.
 * - SuggestActionItemsInput - The input type for the suggestActionItems function.
 * - SuggestActionItemsOutput - The return type for the suggestActionItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestActionItemsInputSchema = z.object({
  jobTitle: z.string().describe('The title of the job application.'),
  companyName: z.string().describe('The name of the company.'),
  applicationStatus: z.string().describe('The current status of the job application (e.g., Applied, Interviewing, Offer, Rejected).'),
  applicationDate: z.string().describe('The date when the application was submitted (YYYY-MM-DD).'),
  jobPostingLink: z.string().optional().describe('A link to the job posting.'),
  salaryExpectation: z.string().optional().describe('The expected salary for the job.'),
  notes: z.string().optional().describe('Any notes about the application.'),
});
export type SuggestActionItemsInput = z.infer<typeof SuggestActionItemsInputSchema>;

const SuggestActionItemsOutputSchema = z.object({
  actionItems: z.array(
    z.string().describe('A list of suggested action items for the job application.')
  ).describe('Suggested action items to help the user stay organized and proactive.'),
  reasoning: z.string().describe('The reasoning behind the suggested action items.'),
});
export type SuggestActionItemsOutput = z.infer<typeof SuggestActionItemsOutputSchema>;

export async function suggestActionItems(input: SuggestActionItemsInput): Promise<SuggestActionItemsOutput> {
  return suggestActionItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestActionItemsPrompt',
  input: {schema: SuggestActionItemsInputSchema},
  output: {schema: SuggestActionItemsOutputSchema},
  prompt: `You are an AI assistant designed to provide helpful action items for job applications based on their current status.

  Given the following job application details, suggest a list of action items that the user should take to stay organized and proactive in their job search.
  Explain your reasoning for the action items.

  Job Title: {{{jobTitle}}}
  Company Name: {{{companyName}}}
  Application Status: {{{applicationStatus}}}
  Application Date: {{{applicationDate}}}
  Job Posting Link: {{{jobPostingLink}}}
  Salary Expectation: {{{salaryExpectation}}}
  Notes: {{{notes}}}

  Provide the action items as a list of strings.
`,
});

const suggestActionItemsFlow = ai.defineFlow(
  {
    name: 'suggestActionItemsFlow',
    inputSchema: SuggestActionItemsInputSchema,
    outputSchema: SuggestActionItemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
