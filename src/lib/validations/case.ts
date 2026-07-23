import { z } from "zod";

export const practiceAreaEnum = z.enum([
  'corporate',
  'litigation',
  'family',
  'family_law',
  'criminal',
  'intellectual_property',
  'real_estate',
  'employment',
  'immigration',
  'tax',
  'other'
]);

export const caseCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  anonymizedSummary: z.string().min(1, "Anonymized summary is required"),
  fullDescription: z.string().min(1, "Full description is required"),
  rawDescription: z.string().optional(),
  practiceArea: practiceAreaEnum,
  jurisdictionId: z.string().min(1, "Jurisdiction is required"),
  riskLevel: z.enum(['low', 'medium', 'high']).optional(),
  budgetMinCents: z.number().nullable().optional(),
  budgetMaxCents: z.number().nullable().optional(),
});

export const createCaseSchema = caseCreateSchema;

export type CaseCreateInput = z.infer<typeof caseCreateSchema>;
export type CreateCaseInput = CaseCreateInput;
