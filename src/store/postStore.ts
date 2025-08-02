import { create } from "zustand";
import { apiService } from "../services/api";

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags?: string[];
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PostState {
  posts: Post[];
  currentPost: Post | null;
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string;
  currentPage: number;
  postsPerPage: number;

  // Actions
  fetchPosts: () => Promise<void>;
  createPost: (post: Omit<Post, "id">) => Promise<void>;
  updatePost: (id: number, post: Partial<Post>) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
  setCurrentPost: (post: Post | null) => void;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setCurrentPage: (page: number) => void;
  clearError: () => void;
}

// Available categories for consistency
export const AVAILABLE_CATEGORIES = [
  "Technology",
  "Lifestyle",
  "Business",
  "Travel",
  "Food",
  "Health",
  "Sports",
  "Entertainment",
  "Education",
  "Science",
];

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,
  searchTerm: "",
  selectedCategory: "",
  currentPage: 1,
  postsPerPage: 10,

  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const posts: Post[] = await apiService.getPosts();

      // Add mock data for tags and categories
      const postsWithMetadata = posts.map((post, index) => ({
        ...post,
        tags: [`tag${index + 1}`, `tech`, `blog`],
        category: AVAILABLE_CATEGORIES[index % AVAILABLE_CATEGORIES.length],
        createdAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      set({ posts: postsWithMetadata, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch posts",
        isLoading: false,
      });
    }
  },

  createPost: async (postData) => {
    set({ isLoading: true, error: null });
    try {
      // Create a new post with a unique ID
      const newPost: Post = {
        id: Date.now(), // Use timestamp as unique ID
        ...postData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to local state immediately for better UX
      const { posts } = get();
      set({
        posts: [newPost, ...posts],
        isLoading: false,
      });

      // Also try to create on the server (JSONPlaceholder will return the same data)
      try {
        await apiService.createPost(postData);
      } catch (serverError) {
        console.warn(
          "Server creation failed, but post is saved locally:",
          serverError
        );
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create post",
        isLoading: false,
      });
    }
  },

  updatePost: async (id, postData) => {
    set({ isLoading: true, error: null });
    try {
      const { posts } = get();
      const existingPost = posts.find((p) => p.id === id);

      if (!existingPost) {
        throw new Error("Post not found");
      }

      const updatedPost: Post = {
        ...existingPost,
        ...postData,
        updatedAt: new Date().toISOString(),
      };

      set({
        posts: posts.map((post) => (post.id === id ? updatedPost : post)),
        isLoading: false,
      });

      // Also try to update on the server
      try {
        await apiService.updatePost(id, postData);
      } catch (serverError) {
        console.warn(
          "Server update failed, but post is updated locally:",
          serverError
        );
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update post",
        isLoading: false,
      });
    }
  },

  deletePost: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { posts } = get();

      set({
        posts: posts.filter((post) => post.id !== id),
        isLoading: false,
      });

      // Also try to delete on the server
      try {
        await apiService.deletePost(id);
      } catch (serverError) {
        console.warn(
          "Server deletion failed, but post is removed locally:",
          serverError
        );
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete post",
        isLoading: false,
      });
    }
  },

  setCurrentPost: (post) => {
    set({ currentPost: post });
  },

  setSearchTerm: (term) => {
    set({ searchTerm: term, currentPage: 1 });
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category, currentPage: 1 });
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },

  clearError: () => {
    set({ error: null });
  },
}));
