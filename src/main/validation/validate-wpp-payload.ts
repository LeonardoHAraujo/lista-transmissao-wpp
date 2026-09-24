import { z } from 'zod';

const DimensionsSchema = z.object({
  widthVal: z.number().min(0, 'A largura deve ser um número positivo.'),
  heightVal: z.number().min(0, 'A altura deve ser um número positivo.'),
  lengthVal: z.number().min(0, 'O comprimento deve ser um número positivo.'),
});

const CotationSchema = z.object({
  origin: z.string().nonempty('A origem é obrigatória.'),
  destiny: z.string().nonempty('O destino é obrigatório.'),
  price: z.number().min(0, 'O preço deve ser um número positivo.'),
  grossWeight: z.number().min(0, 'O peso bruto deve ser um numero positivo.'),
  cubWeight: z.number().min(0, 'O peso cubado deve ser um numero positivo.'),
  qtdVol: z.number().min(0, 'A quantidade de volumes deve ser um numero positivo.'),
  commodityPrice: z.number().min(0, 'O valor da mercadoria deve ser um numero positivo.'),
  dimensions: z.array(DimensionsSchema).min(1, 'É necessário pelo menos uma dimensão.'),
});

const WhatsappSchema = z.object({
  name: z.string().nonempty('O nome é obrigatório.'),
  phoneNumber: z.string().nonempty('O número de telefone é obrigatório.'),
  cotations: z.array(CotationSchema).min(1, 'É necessário pelo menos uma cotação.'),
});

const PayloadSchema = z.object({
  whatsapp: WhatsappSchema,
});

export function validateWppPayload(payload: any) {
  const result = PayloadSchema.safeParse(payload);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.format()
    };
  }

  return { success: true, data: result.data };
}
