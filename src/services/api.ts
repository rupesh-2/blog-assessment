import { getToken } from "../utils/jwt";

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

interface Album {
  id: number;
  userId: number;
  title: string;
}

interface Photo {
  id: number;
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

// API service with authentication
class ApiService {
  private getHeaders(): HeadersInit {
    const token = getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        // Don't throw for 500 errors from JSONPlaceholder as they're expected
        if (response.status === 500) {
          console.warn(
            `JSONPlaceholder returned 500 for ${endpoint} - this is expected for write operations`
          );
          throw new Error("JSONPlaceholder doesn't support this operation");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // Only log as error if it's not an expected JSONPlaceholder limitation
      if (error instanceof Error && error.message.includes("JSONPlaceholder")) {
        console.warn(
          "API request failed (expected with JSONPlaceholder):",
          error.message
        );
      } else {
        console.error("API request failed:", error);
      }
      throw error;
    }
  }

  // Posts API
  async getPosts(): Promise<Post[]> {
    return this.request<Post[]>("/posts");
  }

  async getPost(id: number): Promise<Post> {
    return this.request<Post>(`/posts/${id}`);
  }

  async createPost(postData: Omit<Post, "id">): Promise<Post> {
    try {
      return await this.request<Post>("/posts", {
        method: "POST",
        body: JSON.stringify(postData),
      });
    } catch (error) {
      // JSONPlaceholder doesn't support real creation, so we'll return a mock response
      console.warn(
        "JSONPlaceholder doesn't support real creation, returning mock response"
      );
      return {
        id: Math.floor(Math.random() * 1000) + 200, // Use a random ID to avoid conflicts
        ...postData,
      } as Post;
    }
  }

  async updatePost(id: number, postData: Partial<Post>): Promise<Post> {
    try {
      return await this.request<Post>(`/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify(postData),
      });
    } catch (error) {
      // JSONPlaceholder doesn't support real updates, so we'll return a mock response
      console.warn(
        "JSONPlaceholder doesn't support real updates, returning mock response"
      );
      return {
        id,
        ...postData,
      } as Post;
    }
  }

  async deletePost(id: number): Promise<void> {
    try {
      return await this.request<void>(`/posts/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      // JSONPlaceholder doesn't support real deletion, so we'll just return
      console.warn(
        "JSONPlaceholder doesn't support real deletion, returning success"
      );
      return;
    }
  }

  // Users API
  async getUsers(): Promise<User[]> {
    return this.request<User[]>("/users");
  }

  async getUser(id: number): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  // Comments API
  async getComments(): Promise<Comment[]> {
    return this.request<Comment[]>("/comments");
  }

  async getPostComments(postId: number): Promise<Comment[]> {
    return this.request<Comment[]>(`/posts/${postId}/comments`);
  }

  // Albums API
  async getAlbums(): Promise<Album[]> {
    return this.request<Album[]>("/albums");
  }

  async getAlbum(id: number): Promise<Album> {
    return this.request<Album>(`/albums/${id}`);
  }

  // Photos API
  async getPhotos(): Promise<Photo[]> {
    return this.request<Photo[]>("/photos");
  }

  async getAlbumPhotos(albumId: number): Promise<Photo[]> {
    return this.request<Photo[]>(`/albums/${albumId}/photos`);
  }

  // Todos API
  async getTodos(): Promise<Todo[]> {
    return this.request<Todo[]>("/todos");
  }

  async getUserTodos(userId: number): Promise<Todo[]> {
    return this.request<Todo[]>(`/users/${userId}/todos`);
  }
}

export const apiService = new ApiService();
