import { usePostStore } from "../store/postStore";
import { useMemo } from "react";
import { AVAILABLE_CATEGORIES } from "../store/postStore";

export const usePosts = () => {
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

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    let filtered = posts;
    console.log("Filtering posts:", {
      totalPosts: posts.length,
      search,
      filter,
      posts: posts.slice(0, 3), // Log first 3 posts for debugging
    });

    // Filter by search term
    if (search) {
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(search.toLowerCase())
      );
      console.log("After search filter:", filtered.length, "posts");
    }

    // Filter by category
    if (filter) {
      filtered = filtered.filter((post) => post.category === filter);
      console.log("After category filter:", filtered.length, "posts");
    }

    console.log("Final filtered posts:", filtered.length);
    return filtered;
  }, [posts, search, filter]);

  // Paginate posts
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, currentPage, postsPerPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredPosts.length / postsPerPage);
  }, [filteredPosts.length, postsPerPage]);

  // Get unique categories from posts
  const categories = useMemo(() => {
    const postCategories = [
      ...new Set(posts.map((post) => post.category)),
    ].filter(Boolean);
    // Combine post categories with available categories to ensure all are shown
    return [...new Set([...AVAILABLE_CATEGORIES, ...postCategories])];
  }, [posts]);

  return {
    posts: paginatedPosts, // For display (paginated)
    allPosts: posts, // For operations (all posts)
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
