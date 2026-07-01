import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from './config';

export interface UploadResult {
  url: string;
}

export async function uploadImage(file: File): Promise<UploadResult> {
  if (
    CLOUDINARY_CLOUD_NAME === 'YOUR_CLOUD_NAME' ||
    CLOUDINARY_UPLOAD_PRESET === 'YOUR_UPLOAD_PRESET'
  ) {
    throw new Error('Cloudinary баптаулары толтырылмаған (config.ts файлын қара)');
  }

  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: fd }
  );

  if (!res.ok) throw new Error('Cloudinary жүктеу қатесі');

  const data = await res.json() as { secure_url?: string };
  if (!data.secure_url) throw new Error('URL алынбады');

  return { url: data.secure_url };
}
