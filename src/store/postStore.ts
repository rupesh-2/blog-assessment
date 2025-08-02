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
      // Create post using the API
      const createdPost = await apiService.createPost({
        title: postData.title,
        body: postData.body,
        userId: postData.userId,
      });

      // Add metadata to the created post
      const newPost: Post = {
        ...createdPost,
        tags: postData.tags || [],
        category: postData.category || "Technology",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to local state
      const { posts } = get();
      set({
        posts: [newPost, ...posts],
        isLoading: false,
      });

      console.log("Post created successfully:", newPost);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create post",
        isLoading: false,
      });
      throw error;
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

      // Update post using the API
      const updatedPostResponse = await apiService.updatePost(id, {
        title: postData.title,
        body: postData.body,
        userId: existingPost.userId,
      });

      // Create updated post with metadata
      const updatedPost: Post = {
        ...updatedPostResponse,
        tags: postData.tags || existingPost.tags || [],
        category: postData.category || existingPost.category || "Technology",
        createdAt: existingPost.createdAt,
        updatedAt: new Date().toISOString(),
      };

      set({
        posts: posts.map((post) => (post.id === id ? updatedPost : post)),
        isLoading: false,
      });

      console.log("Post updated successfully:", updatedPost);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update post",
        isLoading: false,
      });
      throw error;
    }
  },

  deletePost: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Delete post using the API
      await apiService.deletePost(id);

      // Remove from local state
      const { posts } = get();
      set({
        posts: posts.filter((post) => post.id !== id),
        isLoading: false,
      });

      console.log("Post deleted successfully:", id);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete post",
        isLoading: false,
      });
      throw error;
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
