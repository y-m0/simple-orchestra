
// Mock authentication module for testing purposes

interface MockUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface LoginResponse {
  token: string;
  user: MockUser;
}

export const mockAuth = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    // This is a mock implementation
    if (email === 'test@example.com' && password === 'password') {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Store token in localStorage for persistence
      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('auth_token', token);
      
      const user = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user' as const,
      };
      
      return {
        token,
        user,
      };
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    throw new Error('Invalid email or password');
  },

  logout: async (): Promise<void> => {
    // Mock logout implementation
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.removeItem('auth_token');
    return Promise.resolve();
  },

  getCurrentUser: async (): Promise<MockUser> => {
    // Mock implementation to get the current user
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // In a real implementation, this would validate the token
    return {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
    };
  },
};
