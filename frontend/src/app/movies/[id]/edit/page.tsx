'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchMovie, updateMovie, deleteMovie, clearError, clearCurrentMovie } from '@/store/slices/moviesSlice';
import { movieFormSchema } from '@/lib/validations';
import type { MovieFormData as MovieFormDataFromValidation } from '@/lib/validations';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { CustomInput } from '@/components/ui/CustomInput';
import { DynamicImageUpload } from '@/components/ui/DynamicImageUpload';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ConfirmationModal } from '@/components/ui/CustomModal';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

export default function EditMoviePage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { currentMovie, isLoading, isUpdating, isDeleting, error } = useAppSelector((state) => state.movies);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const movieId = params.id as string;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<MovieFormDataFromValidation>({
    resolver: zodResolver(movieFormSchema),
  });

  const posterValue = watch('poster');

  useEffect(() => {
    if (movieId) {
      dispatch(fetchMovie(movieId));
    }

    return () => {
      dispatch(clearCurrentMovie());
    };
  }, [dispatch, movieId]);

  useEffect(() => {
    if (currentMovie) {
      reset({
        title: currentMovie.title,
        publishingYear: currentMovie.publishingYear.toString(),
        poster: currentMovie.poster || '',
      } as unknown as MovieFormDataFromValidation);
    }
  }, [currentMovie, reset]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data: MovieFormDataFromValidation) => {
    try {
      await dispatch(updateMovie({
        id: movieId,
        data: {
          title: data.title,
          publishingYear: data.publishingYear,
          poster: data.poster || undefined,
        }
      })).unwrap();
      
      toast.success('Movie updated successfully!');
      router.push('/movies');
    } catch (error) {
      // Error handling is done in the useEffect above
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteMovie(movieId)).unwrap();
      toast.success('Movie deleted successfully!');
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

  if (isLoading || !currentMovie) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background bg-[url('/bg.png')] bg-no-repeat bg-bottom bg-[length:100%_111px] bg-fixed">
      <div className="container mx-auto px-5 py-8 max-w-4xl">
        <h1 className="text-heading-2 text-white m-0 mb-16">Edit</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Upload */}
            <div className="space-y-4">
              <DynamicImageUpload
                onImageUploaded={handlePosterUploaded}
                currentImage={posterValue}
                uploadText="Drop other image here"
              />
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <CustomInput
                {...register('title')}
                placeholder="Title"
                variant="edit-large"
                error={errors.title?.message as string}
              />

              <CustomInput
                {...register('publishingYear')}
                type="text"
                placeholder="Publishing year"
                variant="edit-small"
                error={errors.publishingYear?.message as string}
              />

              {/* Action Buttons */}
              <div className="flex flex-col space-y-4 pt-8">
                <div className="flex space-x-4">
                  <PrimaryButton
                    type="button"
                    onClick={handleCancel}
                    variant="cancel"
                    size="edit"
                    disabled={isUpdating || isDeleting}
                  >
                    Cancel
                  </PrimaryButton>
                  
                  <PrimaryButton
                    type="submit"
                    variant="update"
                    size="edit"
                    disabled={isUpdating || isDeleting}
                    isLoading={isUpdating}
                    loadingText="Updating..."
                  >
                    Update
                  </PrimaryButton>
                </div>

                <PrimaryButton
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  variant="delete"
                  size="edit"
                  disabled={isUpdating || isDeleting}
                  isLoading={isDeleting}
                  loadingText="Deleting..."
                >
                  Delete Movie
                </PrimaryButton>
              </div>
            </div>
          </div>
        </form>

        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="Delete Movie"
          message={`Are you sure you want to delete "${currentMovie.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}
