import { PRODUCTS } from './config';
import type { ProductKey } from './types';

export interface CalcResult {
  areaM2: number;
  unitPrice: number;
  total: number;
}

export function calcPrice(
  productKey: ProductKey,
  materialId: string,
  widthCm: number,
  heightCm: number,
  qty: number
): CalcResult {
  const product = PRODUCTS[productKey];
  const material = product.materials.find(m => m.id === materialId)
    ?? product.materials[0];

  const areaM2 = (widthCm / 100) * (heightCm / 100);
  const unitPrice = material.pricePerM2;
  const total = areaM2 * unitPrice * qty;

  return { areaM2, unitPrice, total };
}

export function formatPrice(n: number): string {
  return Math.round(n).toLocaleString('ru-RU') + ' ₸';
}
