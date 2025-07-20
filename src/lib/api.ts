import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

class ApiClient {
  private client: AxiosInstance
  private retryCount: number = 0

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor for retry logic and error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (this.shouldRetry(error) && this.retryCount < MAX_RETRIES) {
          this.retryCount++
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
          return this.client(error.config!)
        }
        this.retryCount = 0

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }

        throw this.handleError(error)
      }
    )
  }

  private shouldRetry(error: AxiosError): boolean {
    return (
      error.response?.status === 429 || // Too Many Requests
      error.response?.status === 503 || // Service Unavailable
      error.response?.status === 504 || // Gateway Timeout
      !error.response // Network error
    )
  }

  private handleError(error: AxiosError) {
    if (error.response) {
      // Server responded with error
      const status = error.response.status
      const data = error.response.data

      switch (status) {
        case 400:
          return new Error('Bad Request: ' + JSON.stringify(data))
        case 401:
          return new Error('Unauthorized: Please login again')
        case 403:
          return new Error('Forbidden: You do not have permission')
        case 404:
          return new Error('Not Found: Resource not available')
        case 500:
          return new Error('Server Error: Please try again later')
        default:
          return new Error(`Error ${status}: ${JSON.stringify(data)}`)
      }
    } else if (error.request) {
      // Request made but no response
      return new Error('Network Error: Please check your connection')
    } else {
      // Error in request setup
      return error
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config)
      return response.data
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config)
      return response.data
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.put<T>(url, data, config)
      return response.data
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<T>(url, config)
      return response.data
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }
}

// Create an instance with your API base URL
export const api = new ApiClient(import.meta.env.VITE_API_URL || 'http://localhost:3000/api') 