import type { ProductKey, Product } from './types';

// ─────────────────────────────────────────────────────
//  ⚠️  БҰЛ ФАЙЛДЫ ҒАНА ӨЗГЕРТ — баға, нөмір, credentials
// ─────────────────────────────────────────────────────

/** WhatsApp нөмірі (елдің коды + нөмір, + жоқ) */
export const WHATSAPP_NUMBER = '77000000000';

/**
 * Cloudinary тегін аккаунт керек → cloudinary.com
 *  1) Dashboard → Cloud name көшір
 *  2) Settings → Upload → Upload presets → Add preset
 *     Signing Mode = "Unsigned" → сақта → атын көшір
 */
export const CLOUDINARY_CLOUD_NAME = 'YOUR_CLOUD_NAME';
export const CLOUDINARY_UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET';

// ─────────────────────────────────────────────────────
//  Өнімдер мен бағалар
// ─────────────────────────────────────────────────────
export const PRODUCTS: Record<ProductKey, Product> = {
  banner: {
    name: 'Баннер',
    icon: '🏳️',
    materials: [
      { id: 'mesh_free',  name: 'Баннер (көзшелер тегін)',   pricePerM2: 2000 },
      { id: 'vinyl_self', name: 'Винил (өзіндік жабысқақ)',  pricePerM2: 2500 },
    ],
  },
  stand: {
    name: 'Стенд',
    icon: '📐',
    materials: [
      { id: 'no_border',   name: 'Бортиксіз',                pricePerM2: 5000 },
      { id: 'with_border', name: 'Бортикпен / тірегішпен',   pricePerM2: 7000 },
    ],
  },
};
