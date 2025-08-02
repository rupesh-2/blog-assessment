"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { useUserPosts } from "../../hooks/useUserPosts";
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
  } = useUserPosts();

  useEffect(() => {
    console.log("Dashboard mounted, fetching posts");
    console.log("Current user:", user);
    console.log("Current posts count before fetch:", posts.length);
    fetchPosts();
  }, [fetchPosts, user]);

  useEffect(() => {
    console.log(
      "Dashboard posts updated:",
      posts.length,
      "allPosts (user posts):",
      allPosts.length,
      "User ID:",
      user?.id
    );
  }, [posts, allPosts, user]);

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Dashboard
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Welcome back, {user?.name}! Manage your blog posts here.
                </p>
                <p className="text-sm text-muted-foreground">
                  Showing {allPosts.length} of your posts
                </p>
              </div>
              <button
                onClick={() => router.push("/posts/create")}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors w-full sm:w-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Create Post</span>
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 bg-card text-card-foreground rounded-lg shadow border border-border p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
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
            <div className="mb-6 bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Posts Grid */}
          {!isLoading && posts.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
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
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-2 sm:px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            page === currentPage
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground bg-card border border-border hover:bg-accent"
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
                    className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!isLoading && posts.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
                <Search className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {search || filter ? "No posts found" : "No posts yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {search || filter
                  ? "Try adjusting your search or filter criteria."
                  : "You haven't created any blog posts yet. Get started by creating your first post!"}
              </p>
              {!search && !filter && (
                <button
                  onClick={() => router.push("/posts/create")}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
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
