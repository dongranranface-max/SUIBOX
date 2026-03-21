import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary, uploadBase64ToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const base64 = formData.get('base64') as string;
    
    let result;
    
    if (file) {
      result = await uploadToCloudinary(file);
    } else if (base64) {
      result = await uploadBase64ToCloudinary(base64);
    } else {
      return NextResponse.json(
        { error: 'No file or base64 data provided' },
        { status: 400 }
      );
    }
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ url: result.url, success: true });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

// 设置上传大小限制
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
