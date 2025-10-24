'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { uploadPoster } from '@/store/slices/moviesSlice';
import { isValidImageFile, getImageUrl } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface ImageUploadProps {
  onImageUploaded: (imagePath: string) => void;
  currentImage?: string;
  uploadText?: string;
}

export function ImageUpload({ onImageUploaded, currentImage, uploadText = "Drop an image here" }: ImageUploadProps) {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage ? getImageUrl(currentImage) : null);

  // Update preview when currentImage prop changes
  useEffect(() => {
    if (currentImage) {
      setPreviewUrl(getImageUrl(currentImage));
    } else {
      setPreviewUrl(null);
    }
  }, [currentImage]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!isValidImageFile(file)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF) under 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const response = await dispatch(uploadPoster(file)).unwrap();
      setPreviewUrl(getImageUrl(response.path));
      onImageUploaded(response.path);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  }, [dispatch, onImageUploaded]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`upload-area relative ${isDragOver ? 'dragover' : ''} ${
          previewUrl ? 'p-0' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!previewUrl ? handleClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin border-2 border-white/20 border-t-white rounded-full w-8 h-8 mb-4" />
            <p className="text-text-secondary">Uploading image...</p>
          </div>
        ) : previewUrl ? (
          <div className="relative group">
            <Image
              src={previewUrl}
              alt="Movie poster preview"
              width={400}
              height={600}
              className="w-full h-[400px] object-cover rounded-lg"
            />
            
            {/* Remove button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
              className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Change image overlay */}
            <div 
              className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg"
              onClick={handleClick}
            >
              <div className="text-center">
                <Upload className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white text-sm">Click to change image</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <Upload className="w-12 h-12 text-text-muted mb-4" />
            <p className="text-text-secondary text-lg">{uploadText}</p>
            <p className="text-text-muted text-sm mt-2">
              Supported formats: JPEG, PNG, GIF (Max 5MB)
            </p>
          </div>
        )}
      </div>

      {previewUrl && (
        <button
          type="button"
          onClick={handleClick}
          className="w-full py-2 text-primary-400 hover:text-primary-300 text-sm"
        >
          Change image
        </button>
      )}
    </div>
  );
}
