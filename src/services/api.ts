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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
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
    return this.request<Post>("/posts", {
      method: "POST",
      body: JSON.stringify(postData),
    });
  }

  async updatePost(id: number, postData: Partial<Post>): Promise<Post> {
    return this.request<Post>(`/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(postData),
    });
  }

  async deletePost(id: number): Promise<void> {
    return this.request<void>(`/posts/${id}`, {
      method: "DELETE",
    });
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
