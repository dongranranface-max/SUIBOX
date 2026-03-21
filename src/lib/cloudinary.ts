// Cloudinary 上传配置
export const cloudinaryConfig = {
  cloudName: 'dongranranface',
  uploadPreset: 'suibox_nft',
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '',
};

// 上传图片到 Cloudinary
export async function uploadToCloudinary(file: File): Promise<{ url: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    const data = await response.json();
    
    if (data.secure_url) {
      return { url: data.secure_url };
    } else {
      return { url: '', error: data.error?.message || 'Upload failed' };
    }
  } catch (error) {
    return { url: '', error: 'Upload failed' };
  }
}

// 从 base64 上传
export async function uploadBase64ToCloudinary(base64Data: string): Promise<{ url: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('file', base64Data);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    const data = await response.json();
    
    if (data.secure_url) {
      return { url: data.secure_url };
    } else {
      return { url: '', error: data.error?.message || 'Upload failed' };
    }
  } catch (error) {
    return { url: '', error: 'Upload failed' };
  }
}
