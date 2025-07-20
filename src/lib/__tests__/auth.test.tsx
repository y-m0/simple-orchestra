import '@testing-library/jest-dom'
import { render, screen, waitFor, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../auth'
import { mockAuth } from '../mockAuth'

// Mock the mockAuth module
jest.mock('../mockAuth', () => ({
  mockAuth: {
    login: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
  },
}))

const TestComponent = () => {
  const { isAuthenticated, user, loading, error } = useAuth()
  return (
    <div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      <div data-testid="user">{user ? user.email : 'No User'}</div>
      <div data-testid="error">{error || 'No Error'}</div>
    </div>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('should show loading state initially', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('loading')).toHaveTextContent('Loading')
  })

  it('should handle successful login', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user' as const,
    }

    ;(mockAuth.login as jest.Mock).mockResolvedValueOnce({
      token: 'mock-token',
      user: mockUser,
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated')
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com')
    })
  })

  it('should handle login failure', async () => {
    ;(mockAuth.login as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'))

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated')
      expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials')
    })
  })

  it('should handle token expiration', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user' as const,
    }

    ;(mockAuth.getCurrentUser as jest.Mock)
      .mockResolvedValueOnce(mockUser)
      .mockRejectedValueOnce(new Error('Token expired'))

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated')
    })

    // Simulate token expiration
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated')
    })
  })
}) 