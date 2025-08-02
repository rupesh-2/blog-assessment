"use client";

import { usePosts } from "../../hooks/usePosts";
import { useAuth } from "../../hooks/useAuth";

export default function TestPage() {
  const { createPost, posts, allPosts, fetchPosts } = usePosts();
  const { user } = useAuth();

  const handleTestCreate = async () => {
    console.log("Testing create post...");
    try {
      await createPost({
        title: "Test Post " + Date.now(),
        body: "This is a test post created at " + new Date().toISOString(),
        userId: 1,
        category: "Technology",
        tags: ["test", "debug"],
      });
      console.log("Test create completed");
    } catch (error) {
      console.error("Test create failed:", error);
    }
  };

  const handleFetchPosts = async () => {
    console.log("Testing fetch posts...");
    try {
      await fetchPosts();
      console.log("Test fetch completed");
    } catch (error) {
      console.error("Test fetch failed:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>

      <div className="space-y-4">
        <div>
          <p>User: {user?.name || "Not logged in"}</p>
          <p>Posts count: {posts.length}</p>
          <p>All posts count: {allPosts.length}</p>
        </div>

        <div className="space-x-4">
          <button
            onClick={handleTestCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Test Create Post
          </button>

          <button
            onClick={handleFetchPosts}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Test Fetch Posts
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Recent Posts:</h2>
          <div className="space-y-2">
            {allPosts.slice(0, 5).map((post) => (
              <div key={post.id} className="p-2 border rounded">
                <p>
                  <strong>ID:</strong> {post.id}
                </p>
                <p>
                  <strong>Title:</strong> {post.title}
                </p>
                <p>
                  <strong>Category:</strong> {post.category}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
