import { getToken } from "../utils/jwt";

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

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
  async getPosts(): Promise<any[]> {
    return this.request<any[]>("/posts");
  }

  async getPost(id: number): Promise<any> {
    return this.request<any>(`/posts/${id}`);
  }

  async createPost(postData: any): Promise<any> {
    return this.request<any>("/posts", {
      method: "POST",
      body: JSON.stringify(postData),
    });
  }

  async updatePost(id: number, postData: any): Promise<any> {
    return this.request<any>(`/posts/${id}`, {
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
  async getUsers(): Promise<any[]> {
    return this.request<any[]>("/users");
  }

  async getUser(id: number): Promise<any> {
    return this.request<any>(`/users/${id}`);
  }

  // Comments API
  async getComments(): Promise<any[]> {
    return this.request<any[]>("/comments");
  }

  async getPostComments(postId: number): Promise<any[]> {
    return this.request<any[]>(`/posts/${postId}/comments`);
  }

  // Albums API
  async getAlbums(): Promise<any[]> {
    return this.request<any[]>("/albums");
  }

  async getAlbum(id: number): Promise<any> {
    return this.request<any>(`/albums/${id}`);
  }

  // Photos API
  async getPhotos(): Promise<any[]> {
    return this.request<any[]>("/photos");
  }

  async getAlbumPhotos(albumId: number): Promise<any[]> {
    return this.request<any[]>(`/albums/${albumId}/photos`);
  }

  // Todos API
  async getTodos(): Promise<any[]> {
    return this.request<any[]>("/todos");
  }

  async getUserTodos(userId: number): Promise<any[]> {
    return this.request<any[]>(`/users/${userId}/todos`);
  }
}

export const apiService = new ApiService();
