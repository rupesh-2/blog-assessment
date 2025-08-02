"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePosts } from "../../../../hooks/usePosts";
import Layout from "../../../../components/Layout";
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
                category: "Technology",
                tags: ["tech", "blog"],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
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
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">Loading post...</span>
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
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Post Not Found
            </h2>
            <p className="text-muted-foreground mb-6">
              The post you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
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
                  {currentPost.title}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {currentPost.createdAt
                        ? new Date(currentPost.createdAt).toLocaleDateString()
                        : "Unknown date"}
                    </span>
                  </div>
                  {currentPost.category && (
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs w-fit">
                      {currentPost.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="bg-card text-card-foreground rounded-lg shadow border border-border p-4 sm:p-8">
          {/* Meta Information */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-border space-y-2 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-muted-foreground">
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
            <span className="text-sm text-muted-foreground">
              Post ID: {currentPost.id}
            </span>
          </div>

          {/* Tags */}
          {currentPost.tags && currentPost.tags.length > 0 && (
            <div className="flex items-center space-x-2 mb-6">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {currentPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="text-foreground leading-relaxed whitespace-pre-wrap">
              {currentPost.body}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors w-full sm:w-auto"
          >
            Back to Posts
          </button>
        </div>
      </div>
    </Layout>
  );
}
