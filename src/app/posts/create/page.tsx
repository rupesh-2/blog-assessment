"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { usePosts } from "../../../hooks/usePosts";
import { useAuth } from "../../../hooks/useAuth";
import { postSchema, PostFormData } from "../../../utils/validation";
import Layout from "../../../components/Layout";
import AuthGuard from "../../../components/AuthGuard";
import { ArrowLeft, Save, X } from "lucide-react";
import { AVAILABLE_CATEGORIES } from "../../../store/postStore";

export default function CreatePostPage() {
  const router = useRouter();
  const { createPost, isLoading, error } = usePosts();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
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
    console.log("Form submitted with data:", data);
    setIsSubmitting(true);
    try {
      const postData = {
        ...data,
        userId: user?.id || 1, // Use current user's ID
        tags: data.tags
          ? data.tags.split(",").map((tag: string) => tag.trim())
          : [],
      };

      console.log("Calling createPost with:", postData);
      await createPost(postData);
      console.log("createPost completed successfully");
      router.push("/dashboard");
    } catch (error) {
      // Note: API errors are expected with JSONPlaceholder as it doesn't support real creation
      console.warn(
        "Create completed locally (API errors are expected with JSONPlaceholder):",
        error
      );
      router.push("/dashboard");
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Create New Post
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Write and publish your next blog post
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-card text-card-foreground rounded-lg shadow border border-border p-6">
              {/* Title */}
              <div className="mb-6">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Post Title *
                </label>
                <input
                  {...register("title")}
                  type="text"
                  id="title"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your post title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="mb-6">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Category *
                </label>
                <select
                  {...register("category")}
                  id="category"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {AVAILABLE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Tags */}
              <div className="mb-6">
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Tags
                </label>
                <input
                  {...register("tags")}
                  type="text"
                  id="tags"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter tags separated by commas (e.g., tech, blog, tutorial)"
                />
                <p className="mt-1 text-sm text-muted-foreground">
                  Separate multiple tags with commas
                </p>
                {errors.tags && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.tags.message}
                  </p>
                )}
              </div>

              {/* Content */}
              <div>
                <label
                  htmlFor="body"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Content *
                </label>
                <textarea
                  {...register("body")}
                  id="body"
                  rows={12}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                  placeholder="Write your post content here..."
                />
                {errors.body && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.body.message}
                  </p>
                )}
                <div className="mt-2 text-sm text-muted-foreground">
                  {watchedBody?.length || 0} characters
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center justify-center space-x-2 px-4 py-2 text-muted-foreground bg-card border border-border rounded-lg hover:bg-accent transition-colors w-full sm:w-auto"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="flex items-center justify-center space-x-2 px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
              >
                {isSubmitting || isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
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
