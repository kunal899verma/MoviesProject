'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { createMovie, clearError } from '@/store/slices/moviesSlice';
import { movieFormSchema, MovieFormData } from '@/lib/validations';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { CustomInput } from '@/components/ui/CustomInput';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { toast } from 'react-hot-toast';

export default function CreateMoviePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isCreating, error } = useAppSelector((state) => state.movies);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MovieFormData>({
    resolver: zodResolver(movieFormSchema),
  });

  const posterValue = watch('poster');

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data: MovieFormData) => {
    try {
      await dispatch(createMovie({
        title: data.title,
        publishingYear: data.publishingYear,
        poster: data.poster || undefined,
      })).unwrap();
      
      toast.success('Movie created successfully!');
      router.push('/movies');
    } catch (error) {
      // Error handling is done in the useEffect above
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handlePosterUploaded = (posterPath: string) => {
    setValue('poster', posterPath);
  };

  return (
    <div className="min-h-screen bg-background bg-[url('/bg.png')] bg-no-repeat bg-bottom bg-[length:100%_111px] bg-fixed">
      <div className="container mx-auto px-5 py-8 max-w-4xl">
        <h1 className="text-heading-2 text-white m-0 mb-16">Create a new movie</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Upload */}
            <div className="space-y-4">
              <ImageUpload
                onImageUploaded={handlePosterUploaded}
                currentImage={posterValue}
                uploadText="Drop an image here"
              />
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <CustomInput
                {...register('title')}
                placeholder="Title"
                variant="edit-large"
                error={errors.title?.message}
              />

              <CustomInput
                {...register('publishingYear')}
                type="text"
                placeholder="Publishing year"
                variant="edit-small"
                error={errors.publishingYear?.message}
              />

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-8">
                <PrimaryButton
                  type="button"
                  onClick={handleCancel}
                  variant="cancel"
                  size="edit"
                  disabled={isCreating}
                >
                  Cancel
                </PrimaryButton>
                
                <PrimaryButton
                  type="submit"
                  variant="update"
                  size="edit"
                  disabled={isCreating}
                  isLoading={isCreating}
                  loadingText="Creating..."
                >
                  Submit
                </PrimaryButton>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
