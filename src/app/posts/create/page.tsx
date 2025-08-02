"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { usePosts } from "../../../hooks/usePosts";
import { postSchema, PostFormData } from "../../../utils/validation";
import Layout from "../../../components/Layout";
import AuthGuard from "../../../components/AuthGuard";
import { ArrowLeft, Save, X } from "lucide-react";

export default function CreatePostPage() {
  const router = useRouter();
  const { createPost, isLoading, error, categories } = usePosts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PostFormData>({
    resolver: yupResolver(postSchema),
    defaultValues: {
      title: "",
      body: "",
      category: "",
      tags: "",
    },
  });

  const watchedBody = watch("body");

  // AuthGuard will handle authentication check

  const onSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);
    try {
      const postData = {
        ...data,
        userId: 1, // Mock user ID
        tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
      };

      await createPost(postData);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <Layout>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Create New Post
                  </h1>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Write and publish your next blog post
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              {/* Title */}
              <div className="mb-6">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Post Title *
                </label>
                <input
                  {...register("title")}
                  type="text"
                  id="title"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your post title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="mb-6">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Category *
                </label>
                <select
                  {...register("category")}
                  id="category"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  <option value="Technology">Technology</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Business">Business</option>
                  <option value="Travel">Travel</option>
                  <option value="Food">Food</option>
                  <option value="Health">Health</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Tags */}
              <div className="mb-6">
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Tags
                </label>
                <input
                  {...register("tags")}
                  type="text"
                  id="tags"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tags separated by commas (e.g., tech, blog, tutorial)"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Separate multiple tags with commas
                </p>
                {errors.tags && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.tags.message}
                  </p>
                )}
              </div>

              {/* Content */}
              <div>
                <label
                  htmlFor="body"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Content *
                </label>
                <textarea
                  {...register("body")}
                  id="body"
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  placeholder="Write your post content here..."
                />
                {errors.body && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.body.message}
                  </p>
                )}
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {watchedBody?.length || 0} characters
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting || isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Publish Post</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </AuthGuard>
  );
}
