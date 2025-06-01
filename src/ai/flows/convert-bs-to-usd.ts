'use server';

/**
 * @fileOverview Converts Bolivianos (BS) to US dollars (USD) using the DolarApi exchange rate.
 *
 * - convertBsToUsd - A function that handles the currency conversion process.
 * - ConvertBsToUsdInput - The input type for the convertBsToUsd function.
 * - ConvertBsToUsdOutput - The return type for the convertBsToUsd function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConvertBsToUsdInputSchema = z.object({
  amountBs: z.number().describe('The amount in Bolivianos (BS) to convert.'),
});
export type ConvertBsToUsdInput = z.infer<typeof ConvertBsToUsdInputSchema>;

const ConvertBsToUsdOutputSchema = z.object({
  amountUsd: z.number().describe('The equivalent amount in US dollars (USD).'),
});
export type ConvertBsToUsdOutput = z.infer<typeof ConvertBsToUsdOutputSchema>;

export async function convertBsToUsd(input: ConvertBsToUsdInput): Promise<ConvertBsToUsdOutput> {
  return convertBsToUsdFlow(input);
}

const getDolarApiExchangeRate = ai.defineTool({
  name: 'getDolarApiExchangeRate',
  description: 'Fetches the current exchange rate from DolarApi.',
  inputSchema: z.object({}),
  outputSchema: z.number(),
},
async () => {
  try {
    // const response = await fetch('https://bo.dolarapi.com/api/v1/dolares/cotizacion/libre');
    const response = await fetch('https://bo.dolarapi.com/v1/dolares/oficial');
    console.log("RESPONSE DOLAR-API", response.body);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.compra;
  } catch (error) {
    console.error('Error fetching exchange rate from DolarApi:', error);
    return 6.96;
  }
});

const prompt = ai.definePrompt({
  name: 'convertBsToUsdPrompt',
  input: {schema: ConvertBsToUsdInputSchema},
  output: {schema: ConvertBsToUsdOutputSchema},
  prompt: `Convert the given amount in Bolivianos (BS) to US dollars (USD).

Amount in BS: {{{amountBs}}}

You must use the getDolarApiExchangeRate tool to get the current exchange rate.`,
  tools: [getDolarApiExchangeRate],
  system: `You are a currency conversion expert. You will be given an amount in Bolivianos (BS) and you must convert it to US dollars (USD) using the current exchange rate. You must use the getDolarApiExchangeRate tool to get the current exchange rate.`,    
});

const convertBsToUsdFlow = ai.defineFlow(
  {
    name: 'convertBsToUsdFlow',
    inputSchema: ConvertBsToUsdInputSchema,
    outputSchema: ConvertBsToUsdOutputSchema,
  },
  async input => {
    const exchangeRate = await getDolarApiExchangeRate({});
    const amountUsd = input.amountBs / exchangeRate;
    return {amountUsd};
  }
);
