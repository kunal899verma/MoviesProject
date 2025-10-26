'use client';

import dynamic from 'next/dynamic';
import { ComponentProps } from 'react';

const ImageUpload = dynamic(() => import('./ImageUpload').then(mod => ({ default: mod.ImageUpload })), {
  ssr: false,
  loading: () => (
    <div className="upload-area flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="animate-pulse">
        <div className="w-12 h-12 bg-gray-300 rounded mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-48"></div>
      </div>
    </div>
  )
});

type ImageUploadProps = ComponentProps<typeof ImageUpload>;

export function DynamicImageUpload(props: ImageUploadProps) {
  return <ImageUpload {...props} />;
}
