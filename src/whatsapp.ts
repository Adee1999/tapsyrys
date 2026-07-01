import { WHATSAPP_NUMBER, PRODUCTS } from './config';
import type { OrderState } from './types';
import { calcPrice, formatPrice } from './calculator';

export function openWhatsApp(state: OrderState): void {
  const product = PRODUCTS[state.productKey];
  const material = product.materials.find(m => m.id === state.materialId)
    ?? product.materials[0];
  const { areaM2, total } = calcPrice(
    state.productKey,
    state.materialId,
    state.widthCm,
    state.heightCm,
    state.qty
  );

  const lines: string[] = [
    'Сәлеметсіз бе! Тапсырыс бергім келеді:',
    '',
    `📦 ${product.name} ${state.widthCm} × ${state.heightCm} см (${areaM2.toFixed(2)} м²)`,
    `🎨 Материал: ${material.name}`,
    `🔢 Саны: ${state.qty} дана`,
  ];

  if (state.title)  lines.push(`📝 Мәтін: ${state.title}`);
  if (state.notes)  lines.push(`💬 Ескертпе: ${state.notes}`);

  lines.push(`💰 Болжалды баға: ${formatPrice(total)}`);

  if (state.imageUrl) {
    lines.push('', `📎 Дизайн суреті: ${state.imageUrl}`);
  }

  const text = encodeURIComponent(lines.join('\n'));
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
}
