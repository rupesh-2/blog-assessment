import { usePostStore } from "../store/postStore";
import { useAuth } from "./useAuth";
import { useMemo } from "react";
import { AVAILABLE_CATEGORIES } from "../store/postStore";

export const useUserPosts = () => {
  const { user } = useAuth();
  const {
    posts,
    currentPost,
    isLoading,
    error,
    search,
    filter,
    currentPage,
    postsPerPage,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    setSearch,
    setFilter,
    setCurrentPage,
    clearError,
  } = usePostStore();

  // Filter posts to show only those created by the current user
  const userPosts = useMemo(() => {
    if (!user) return [];
    return posts.filter((post) => post.userId === user.id);
  }, [posts, user]);

  // Filter and search user posts
  const filteredUserPosts = useMemo(() => {
    let filtered = userPosts;
    console.log("Filtering user posts:", {
      totalUserPosts: userPosts.length,
      search,
      filter,
      posts: userPosts.slice(0, 3), // Log first 3 posts for debugging
    });

    // Filter by search term
    if (search) {
      const beforeSearch = filtered.length;
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.body.toLowerCase().includes(search.toLowerCase()) ||
          (post.category && post.category.toLowerCase().includes(search.toLowerCase()))
      );
      console.log("After search filter:", filtered.length, "posts (was", beforeSearch, ")");
    }

    // Filter by category
    if (filter) {
      const beforeCategory = filtered.length;
      filtered = filtered.filter((post) => post.category && post.category === filter);
      console.log("After category filter:", filtered.length, "posts (was", beforeCategory, ")");
    }

    console.log("Final filtered user posts:", filtered.length);
    return filtered;
  }, [userPosts, search, filter]);

  // Paginate user posts
  const paginatedUserPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredUserPosts.slice(startIndex, endIndex);
  }, [filteredUserPosts, currentPage, postsPerPage]);

  // Calculate total pages for user posts
  const totalPages = useMemo(() => {
    return Math.ceil(filteredUserPosts.length / postsPerPage);
  }, [filteredUserPosts.length, postsPerPage]);

  // Get unique categories from user posts
  const categories = useMemo(() => {
    const postCategories = [
      ...new Set(userPosts.map((post) => post.category)),
    ].filter(Boolean);
    // Combine post categories with available categories to ensure all are shown
    return [...new Set([...AVAILABLE_CATEGORIES, ...postCategories])];
  }, [userPosts]);

  return {
    posts: paginatedUserPosts, // For display (paginated user posts)
    allPosts: userPosts, // For operations (all user posts)
    currentPost,
    isLoading,
    error,
    search,
    filter,
    currentPage,
    totalPages,
    categories,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    setSearch,
    setFilter,
    setCurrentPage,
    clearError,
  };
}; 