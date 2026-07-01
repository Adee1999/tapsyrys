import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from './config';

export interface UploadResult {
  url: string;
}

export async function uploadImage(file: File): Promise<UploadResult> {
  // Placeholder тексеру — string-ке cast ету арқылы TS2367 қатесін болдырмаймыз
  const cloudName = CLOUDINARY_CLOUD_NAME as string;
  const preset = CLOUDINARY_UPLOAD_PRESET as string;

  if (cloudName === 'YOUR_CLOUD_NAME' || preset === 'YOUR_UPLOAD_PRESET') {
    throw new Error('Cloudinary баптаулары толтырылмаған (config.ts файлын қара)');
  }

  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', preset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: fd }
  );

  if (!res.ok) throw new Error('Cloudinary жүктеу қатесі');

  const data = await res.json() as { secure_url?: string };
  if (!data.secure_url) throw new Error('URL алынбады');

  return { url: data.secure_url };
}
