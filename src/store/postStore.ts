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
        category:
          index % 3 === 0
            ? "Technology"
            : index % 3 === 1
            ? "Lifestyle"
            : "Business",
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
      const newPost: Post = await apiService.createPost(postData);
      const { posts } = get();

      set({
        posts: [newPost, ...posts],
        isLoading: false,
      });
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
      const updatedPost: Post = await apiService.updatePost(id, postData);
      const { posts } = get();

      set({
        posts: posts.map((post) => (post.id === id ? updatedPost : post)),
        isLoading: false,
      });
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
      await apiService.deletePost(id);
      const { posts } = get();

      set({
        posts: posts.filter((post) => post.id !== id),
        isLoading: false,
      });
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
