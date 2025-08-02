"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { usePosts } from "../../hooks/usePosts";
import Layout from "../../components/Layout";
import PostCard from "../../components/PostCard";
import AuthGuard from "../../components/AuthGuard";
import { Search, Filter, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Post } from "../../store/postStore";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    posts,
    allPosts,
    isLoading,
    error,
    search,
    filter,
    currentPage,
    totalPages,
    categories,
    fetchPosts,
    setSearch,
    setFilter,
    setCurrentPage,
    deletePost,
  } = usePosts();

  useEffect(() => {
    console.log("Dashboard mounted, fetching posts");
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    console.log(
      "Dashboard posts updated:",
      posts.length,
      "allPosts:",
      allPosts.length
    );
  }, [posts, allPosts]);

  const handleEdit = (post: Post) => {
    console.log("Edit clicked for post:", post.id);
    router.push(`/posts/edit/${post.id}`);
  };

  const handleDelete = async (id: number) => {
    console.log("Delete clicked for post:", id);
    await deletePost(id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Debug logging
  useEffect(() => {
    console.log("Dashboard state:", {
      search,
      filter,
      postsCount: posts.length,
    });
  }, [search, filter, posts.length]);

  return (
    <AuthGuard>
      <Layout>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Dashboard
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Welcome back, {user?.name}! Manage your blog posts here.
                </p>
              </div>
              <button
                onClick={() => router.push("/posts/create")}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Create Post</span>
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Posts Grid */}
          {!isLoading && posts.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    showActions={true}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            page === currentPage
                              ? "bg-blue-600 text-white"
                              : "text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!isLoading && posts.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <Search className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No posts found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {search || filter
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by creating your first blog post."}
              </p>
              {!search && !filter && (
                <button
                  onClick={() => router.push("/posts/create")}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create your first post</span>
                </button>
              )}
            </div>
          )}
        </div>
      </Layout>
    </AuthGuard>
  );
}
