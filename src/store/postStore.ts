import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiService } from "../services/api";

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  category?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const AVAILABLE_CATEGORIES = [
  "Technology",
  "Business",
  "Lifestyle",
  "Travel",
  "Food",
  "Health",
  "Education",
  "Entertainment",
  "Sports",
  "Politics",
] as const;

interface PostState {
  posts: Post[];
  currentPost: Post | null;
  isLoading: boolean;
  error: string | null;
  search: string;
  filter: string;
  currentPage: number;
  postsPerPage: number;
  nextId: number;

  // Actions
  fetchPosts: () => Promise<void>;
  createPost: (post: Omit<Post, "id">) => Promise<void>;
  updatePost: (id: number, post: Partial<Post>) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
  setSearch: (search: string) => void;
  setFilter: (filter: string) => void;
  setCurrentPage: (page: number) => void;
  clearError: () => void;
}

export const usePostStore = create<PostState>()(
  persist(
    (set, get) => ({
      posts: [],
      currentPost: null,
      isLoading: false,
      error: null,
      search: "",
      filter: "",
      currentPage: 1,
      postsPerPage: 10,
      nextId: 101, // Start from 101 to avoid conflicts with JSONPlaceholder

      fetchPosts: async () => {
        set({ isLoading: true, error: null });
        try {
          const posts = await apiService.getPosts();

          // Add category and tags to posts from API
          const postsWithMetadata = posts.map((post, index) => ({
            ...post,
            category: AVAILABLE_CATEGORIES[index % AVAILABLE_CATEGORIES.length],
            tags: [`tag${index + 1}`, `tech`, `blog`],
            createdAt: new Date(
              Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
            updatedAt: new Date().toISOString(),
          }));

          set({ posts: postsWithMetadata, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to fetch posts",
            isLoading: false,
          });
        }
      },

      createPost: async (postData) => {
        console.log("createPost called with:", postData);
        set({ isLoading: true, error: null });
        try {
          const { posts, nextId } = get();
          const newPost: Post = {
            ...postData,
            id: nextId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          console.log("Created new post for local state:", newPost);

          // Add to local state immediately
          set({
            posts: [newPost, ...posts],
            nextId: nextId + 1,
            isLoading: false,
          });

          // Try to create on server (but don't rely on it)
          try {
            // Only send required fields to API (title, body, userId)
            const apiPostData = {
              title: postData.title,
              body: postData.body,
              userId: postData.userId,
            };
            console.log("Sending to API:", apiPostData);
            await apiService.createPost(apiPostData);
            console.log("API call successful");
          } catch (error) {
            console.warn(
              "Server-side creation failed (expected with JSONPlaceholder):",
              error
            );
          }
        } catch (error) {
          console.error("Error in createPost:", error);
          set({
            error:
              error instanceof Error ? error.message : "Failed to create post",
            isLoading: false,
          });
        }
      },

      updatePost: async (id, postData) => {
        console.log("updatePost called with id:", id, "data:", postData);
        set({ isLoading: true, error: null });
        try {
          const { posts } = get();
          const existingPost = posts.find((p) => p.id === id);

          if (existingPost) {
            const updatedPost: Post = {
              ...existingPost,
              ...postData,
              updatedAt: new Date().toISOString(),
            };

            console.log("Updated post for local state:", updatedPost);

            // Update local state immediately
            set({
              posts: posts.map((p) => (p.id === id ? updatedPost : p)),
              isLoading: false,
            });

            // Try to update on server (but don't rely on it)
            try {
              // Only send required fields to API (title, body, userId)
              const apiPostData = {
                title: postData.title,
                body: postData.body,
                userId: existingPost.userId,
              };
              console.log("Sending to API:", apiPostData);
              await apiService.updatePost(id, apiPostData);
              console.log("API call successful");
            } catch (error) {
              console.warn(
                "Server-side update failed (expected with JSONPlaceholder):",
                error
              );
            }
          } else {
            throw new Error("Post not found");
          }
        } catch (error) {
          console.error("Error in updatePost:", error);
          set({
            error:
              error instanceof Error ? error.message : "Failed to update post",
            isLoading: false,
          });
        }
      },

      deletePost: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const { posts } = get();

          // Remove from local state immediately
          set({
            posts: posts.filter((p) => p.id !== id),
            isLoading: false,
          });

          // Try to delete on server (but don't rely on it)
          try {
            await apiService.deletePost(id);
          } catch (error) {
            console.warn(
              "Server-side deletion failed (expected with JSONPlaceholder):",
              error
            );
          }
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to delete post",
            isLoading: false,
          });
        }
      },

      setSearch: (search) => set({ search, currentPage: 1 }),
      setFilter: (filter) => set({ filter, currentPage: 1 }),
      setCurrentPage: (currentPage) => set({ currentPage }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "post-storage",
      partialize: (state) => ({
        posts: state.posts,
        nextId: state.nextId,
      }),
      onRehydrateStorage: () => (state) => {
        console.log("Post store rehydrated:", state);
      },
    }
  )
);
