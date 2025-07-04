const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export interface Task {
  id: number;
  title: string;
  description: string;
  completed?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    return response.json();
  }

  // Auth methods
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(credentials),
    });
    const data = await this.handleResponse<AuthResponse>(response);

    // Store token and user data
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(credentials),
    });
    const data = await this.handleResponse<AuthResponse>(response);

    // Store token and user data
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  }

  logout(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  getStoredToken(): string | null {
    return localStorage.getItem("authToken");
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Task[]>(response);
  }

  async createTask(task: {
    title: string;
    description: string;
  }): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(task),
    });
    return this.handleResponse<Task>(response);
  }

  async markTaskAsDone(taskId: number): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/done`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Task>(response);
  }
}

export const apiService = new ApiService();
