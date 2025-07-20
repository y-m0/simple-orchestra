import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

// Base URL for the API
// In production, this would be the actual deployed URL of the DataSummarizationAgent
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Interface for the summarization request
interface SummarizeRequest {
  task_id: string
  payload: {
    text_input: string
  }
}

// Interface for the summarization response
interface SummarizeResponse {
  task_id: string
  status: 'completed' | 'failed'
  result?: {
    summary_output: string
  }
  error?: {
    code: string
    message: string
  }
}

/**
 * Sends a request to summarize the given text
 * @param text The text to summarize
 * @returns A promise that resolves to the summarized text
 */
export const summarizeText = async (text: string): Promise<string> => {
  try {
    // Create a unique task ID
    const taskId = uuidv4()
    
    // Prepare the request payload
    const request: SummarizeRequest = {
      task_id: taskId,
      payload: {
        text_input: text
      }
    }
    
    // Send the request to the API
    const response = await axios.post<SummarizeResponse>(
      `${API_BASE_URL}/tasks/summarize_text`,
      request
    )
    
    // Check if the request was successful
    if (response.data.status === 'completed' && response.data.result) {
      return response.data.result.summary_output
    } else if (response.data.error) {
      throw new Error(response.data.error.message)
    } else {
      throw new Error('Failed to summarize text')
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorData = error.response.data
        throw new Error(errorData.error?.message || 'Failed to summarize text')
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response from server. Please check your connection.')
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(`Error: ${error.message}`)
      }
    }
    throw error
  }
}

/**
 * Fetches the agent card information
 * @returns A promise that resolves to the agent card data
 */
export const getAgentCard = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/.well-known/agent.json`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch agent card:', error)
    throw error
  }
}