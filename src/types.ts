export interface Material {
  id: string;
  name: string;
  pricePerM2: number;
}

export interface Product {
  name: string;
  icon: string;
  materials: Material[];
}

export type ProductKey = 'banner' | 'stand';

export interface OrderState {
  productKey: ProductKey;
  materialId: string;
  widthCm: number;
  heightCm: number;
  qty: number;
  title: string;
  notes: string;
  imageUrl: string | null;
  imageUploading: boolean;
}
