import { ICotation } from '../services/interfaces/payload.interface';

export function formatCotationMessage(
  name: string,
  cotations: ICotation[]
): string {
  const formattedCotations = cotations
    .map((cotation) => {
      const formattedPrice = cotation.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const formatedCommodityPrice = cotation.commodityPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const formattedDimensions = cotation.dimensions!
        .map((dim, index) => `    📦 Volume ${index + 1}: ${dim.widthVal}cm (L) x ${dim.heightVal}cm (A) x ${dim.lengthVal}cm (C)`)
        .join('\n');

      return (
        `📦 *Cotações:*\n\n` +
        `📍 *Origem:* ${cotation.origin}\n` +
        `📍 *Destino:* ${cotation.destiny}\n` +
        `📦 *Peso Bruto:* ${cotation.grossWeight} kg\n` +
        `📦 *Quantidade de Volumes:* ${cotation.qtdVol}\n` +
        `💰 *Valor da Mercadoria:* ${formatedCommodityPrice}\n` +
        `📐 *Dimensões:*\n${formattedDimensions}\n\n` +
        `💰 *Valor Total:* ${formattedPrice}\n`
      );
    })
    .join('\n\n');

  return (
    `🚛 Olá ${name}! Suas cotações de frete estão prontas! 🎉\n\n` +
    formattedCotations +
    `\nA Htex tem um enorme prazer em recebê-lo e está a disposição para lhe esclarecer qualquer dúvida necessária. 😊`
  );
}

export function formatContactMessage(name: string): string {
  return `Olá, ${name}! 🚛\n\n` +
    'Bem-vindo! Qualquer dúvida sobre fretes ou cotações, estou à disposição para te ajudar. É só me chamar! 😉';
}
