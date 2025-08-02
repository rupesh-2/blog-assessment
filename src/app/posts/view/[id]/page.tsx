"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePosts } from "../../../../hooks/usePosts";
import Layout from "../../../../components/Layout";
import AuthGuard from "../../../../components/AuthGuard";
import { ArrowLeft, Calendar, Tag, User } from "lucide-react";
import { use } from "react";
import { Post } from "../../../../store/postStore";

interface ViewPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ViewPostPage({ params }: ViewPostPageProps) {
  const router = useRouter();
  const { allPosts, fetchPosts } = usePosts();
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [isLoadingPost, setIsLoadingPost] = useState(true);

  // Unwrap params using React.use()
  const { id } = use(params);

  useEffect(() => {
    const loadPost = async () => {
      setIsLoadingPost(true);
      try {
        // First try to fetch all posts if not already loaded
        if (allPosts.length === 0) {
          await fetchPosts();
        }

        // Look for the post in allPosts
        const post = allPosts.find((p) => p.id === parseInt(id));

        if (post) {
          setCurrentPost(post);
        } else {
          // If post not found in current posts, try to fetch it individually
          try {
            const { apiService } = await import("../../../../services/api");
            const postData = await apiService.getPost(parseInt(id));
            if (postData.id) {
              const enhancedPost = {
                ...postData,
                category: postData.category || "Technology",
                tags: postData.tags || ["tech", "blog"],
                createdAt: postData.createdAt || new Date().toISOString(),
                updatedAt: postData.updatedAt || new Date().toISOString(),
              };
              setCurrentPost(enhancedPost);
            } else {
              router.push("/");
            }
          } catch (error) {
            console.error("Failed to fetch post:", error);
            router.push("/");
          }
        }
      } catch (error) {
        console.error("Failed to load post:", error);
        router.push("/");
      } finally {
        setIsLoadingPost(false);
      }
    };

    loadPost();
  }, [router, id, fetchPosts, allPosts]);

  // Show loading state while post is being loaded
  if (isLoadingPost) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Loading post...
              </span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error if post not found
  if (!currentPost) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Post Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The post you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
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
                  {currentPost.title}
                </h1>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {currentPost.createdAt
                        ? new Date(currentPost.createdAt).toLocaleDateString()
                        : "Unknown date"}
                    </span>
                  </div>
                  {currentPost.category && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                      {currentPost.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
          {/* Meta Information */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>User ID: {currentPost.userId}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {currentPost.updatedAt
                    ? `Updated: ${new Date(
                        currentPost.updatedAt
                      ).toLocaleDateString()}`
                    : "Unknown update date"}
                </span>
              </div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Post ID: {currentPost.id}
            </span>
          </div>

          {/* Tags */}
          {currentPost.tags && currentPost.tags.length > 0 && (
            <div className="flex items-center space-x-2 mb-6">
              <Tag className="h-4 w-4 text-gray-400" />
              <div className="flex flex-wrap gap-2">
                {currentPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {currentPost.body}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Back to Posts
          </button>
        </div>
      </div>
    </Layout>
  );
}
