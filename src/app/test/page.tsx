"use client";

import { usePosts } from "../../hooks/usePosts";
import { useAuth } from "../../hooks/useAuth";
import { Search, Filter } from "lucide-react";

export default function TestPage() {
  const { user } = useAuth();
  const {
    posts,
    allPosts,
    search,
    filter,
    categories,
    setSearch,
    setFilter,
    fetchPosts,
    createPost,
  } = usePosts();

  const createTestPost = async () => {
    console.log("Creating test post...");
    try {
      await createPost({
        title: "Test Post " + Date.now(),
        body: "This is a test post created at " + new Date().toISOString(),
        userId: user?.id || 1,
        category: "Technology",
        tags: ["test", "debug"],
      });
      console.log("Test post created successfully");
    } catch (error) {
      console.error("Failed to create test post:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Test Page - Search & Filter</h1>

      {/* Debug Info */}
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Debug Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p>
              <strong>Search:</strong> &quot;{search}&quot;
            </p>
            <p>
              <strong>Filter:</strong> &quot;{filter}&quot;
            </p>
            <p>
              <strong>Total Posts:</strong> {allPosts.length}
            </p>
            <p>
              <strong>Filtered Posts:</strong> {posts.length}
            </p>
          </div>
          <div>
            <p>
              <strong>Categories:</strong> {categories.join(", ")}
            </p>
            <p>
              <strong>Available Categories:</strong> {categories.length}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
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

      {/* Test Controls */}
      <div className="mb-6">
        <button
          onClick={fetchPosts}
          className="mr-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Fetch Posts
        </button>
        <button
          onClick={() => setSearch("")}
          className="mr-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Clear Search
        </button>
        <button
          onClick={() => setFilter("")}
          className="mr-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Clear Filter
        </button>
        <button
          onClick={createTestPost}
          className="mr-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Create Test Post
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Posts ({posts.length})</h2>
        {posts.map((post) => (
          <div key={post.id} className="p-4 border rounded-lg">
            <h3 className="font-semibold">{post.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Category: {post.category || "No category"}
            </p>
            <p className="text-sm mt-2">{post.body.substring(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}
