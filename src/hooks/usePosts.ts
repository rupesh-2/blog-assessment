import { usePostStore, Post } from '../store/postStore';
import { useMemo } from 'react';

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
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.body.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    return filtered;
  }, [posts, searchTerm, selectedCategory]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(posts.map(post => post.category))];
    return uniqueCategories.filter(Boolean);
  }, [posts]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, currentPage, postsPerPage]);

  return {
    // State
    posts: paginatedPosts,
    allPosts: posts,
    currentPost,
    isLoading,
    error,
    searchTerm,
    selectedCategory,
    currentPage,
    totalPages,
    categories,
    
    // Actions
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