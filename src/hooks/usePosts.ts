import { usePostStore } from "../store/postStore";
import { useMemo } from "react";
import { AVAILABLE_CATEGORIES } from "../store/postStore";

export const usePosts = () => {
  const {
    posts,
    currentPost,
    isLoading,
    error,
    searchTerm,
    selectedCategory,
    currentPage,
    postsPerPage,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    setCurrentPost,
    setSearchTerm,
    setSelectedCategory,
    setCurrentPage,
    clearError,
  } = usePostStore();

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    return filtered;
  }, [posts, searchTerm, selectedCategory]);

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
    const postCategories = [...new Set(posts.map((post) => post.category))].filter(Boolean);
    // Combine post categories with available categories to ensure all are shown
    return [...new Set([...AVAILABLE_CATEGORIES, ...postCategories])];
  }, [posts]);

  return {
    posts: paginatedPosts, // For display (paginated)
    allPosts: posts, // For operations (all posts)
    currentPost,
    isLoading,
    error,
    searchTerm,
    selectedCategory,
    currentPage,
    totalPages,
    categories,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    setCurrentPost,
    setSearchTerm,
    setSelectedCategory,
    setCurrentPage,
    clearError,
  };
}; 