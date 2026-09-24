import { z } from 'zod';

const WhatsappSchema = z.object({
  name: z.string(),
  phoneNumber: z.string(),
});

const PayloadSchema = z.object({
  whatsapp: WhatsappSchema,
});

export function validateWppContactPayload(payload: any) {
  const result = PayloadSchema.safeParse(payload);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.format()
    };
  }

  return { success: true, data: result.data };
}
