// Access Control Flow
'use server';

/**
 * @fileOverview Access control AI agent.
 *
 * - checkPermissions - A function that checks if a user has permission to delete a resource.
 * - CheckPermissionsInput - The input type for the checkPermissions function.
 * - CheckPermissionsOutput - The return type for the checkPermissions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckPermissionsInputSchema = z.object({
  userName: z.string().describe('The name of the user trying to delete the resource.'),
  resourceType: z.string().describe('The type of resource to be deleted (e.g., Product, Order).'),
});
export type CheckPermissionsInput = z.infer<typeof CheckPermissionsInputSchema>;

const CheckPermissionsOutputSchema = z.object({
  hasPermission: z.boolean().describe('Whether the user has permission to delete the specified resource.'),
  reason: z.string().optional().describe('The reason for the permission decision, if applicable.'),
});
export type CheckPermissionsOutput = z.infer<typeof CheckPermissionsOutputSchema>;

export async function checkPermissions(input: CheckPermissionsInput): Promise<CheckPermissionsOutput> {
  return checkPermissionsFlow(input);
}

const checkPermissionsTool = ai.defineTool({
    name: 'checkPermissionsTool',
    description: 'Checks if a user has permission to delete a specific resource based on their role.',
    inputSchema: CheckPermissionsInputSchema,
    outputSchema: CheckPermissionsOutputSchema,
  },
  async (input: CheckPermissionsInput) => {
    // Default deny in case the LLM fails.
    return {
      hasPermission: input.userName === 'Administrador',
      reason: input.userName === 'Administrador' ? 'User is an administrator' : 'User is not an administrator.',
    };
  }
);

const checkPermissionsPrompt = ai.definePrompt({
  name: 'checkPermissionsPrompt',
  tools: [checkPermissionsTool],
  input: {schema: CheckPermissionsInputSchema},
  output: {schema: CheckPermissionsOutputSchema},
  prompt: `You are an authorization expert. Determine if the user has permission to delete the specified resource. Use the checkPermissionsTool to determine their permissions.

User Name: {{{userName}}}
Resource Type: {{{resourceType}}}

Based on the user's role, determine if they have permission to delete the resource.`,
});

const checkPermissionsFlow = ai.defineFlow(
  {
    name: 'checkPermissionsFlow',
    inputSchema: CheckPermissionsInputSchema,
    outputSchema: CheckPermissionsOutputSchema,
  },
  async input => {
    const {output} = await checkPermissionsPrompt(input);
    return output!;
  }
);
