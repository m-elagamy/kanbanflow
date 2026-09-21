import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .email("Enter a valid email address.");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.");

export const emailPasswordSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const emailSchemaForAuth = z.object({
  email: emailSchema,
});

export const verificationCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Enter the verification code.")
    .regex(/^\d+$/, "The verification code must contain numbers only."),
});

export function getFieldErrors(error: z.ZodError): Record<string, string> {
  return error.issues.reduce<Record<string, string>>((fieldErrors, issue) => {
    const field = issue.path[0];
    if (typeof field === "string" && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
    return fieldErrors;
  }, {});
}

export function getValidationMessage(schema: z.ZodType, value: unknown) {
  const result = schema.safeParse(value);
  return result.success ? null : result.error.issues[0]?.message ?? null;
}
