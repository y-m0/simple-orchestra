import { LLMNode } from '../workflowStore';

export interface LLMExecutionResult {
  success: boolean;
  output: any;
  error?: string;
  duration: number;
}

export class LLMExecutor {
  private static instance: LLMExecutor;
  private nodes: Map<string, LLMNode> = new Map();

  private constructor() {}

  static getInstance(): LLMExecutor {
    if (!LLMExecutor.instance) {
      LLMExecutor.instance = new LLMExecutor();
    }
    return LLMExecutor.instance;
  }

  async execute(node: LLMNode, input: any): Promise<LLMExecutionResult> {
    const startTime = Date.now();
    try {
      let output;
      
      switch (node.type) {
        case 'openai':
          output = await this.executeOpenAI(node, input);
          break;
        case 'huggingface':
          output = await this.executeHuggingFace(node, input);
          break;
        default:
          throw new Error(`Unsupported LLM type: ${node.type}`);
      }

      return {
        success: true,
        output,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        output: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
      };
    }
  }

  private async executeOpenAI(node: LLMNode, input: any): Promise<any> {
    if (!node.config.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${node.config.apiKey}`,
      },
      body: JSON.stringify({
        model: node.config.model,
        messages: [
          {
            role: 'user',
            content: typeof input === 'string' ? input : JSON.stringify(input),
          },
        ],
        temperature: node.config.temperature,
        max_tokens: node.config.maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async executeHuggingFace(node: LLMNode, input: any): Promise<any> {
    if (!node.config.apiKey) {
      throw new Error('Hugging Face API key is required');
    }

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${node.config.model}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${node.config.apiKey}`,
        },
        body: JSON.stringify({
          inputs: typeof input === 'string' ? input : JSON.stringify(input),
          parameters: {
            temperature: node.config.temperature,
            max_length: node.config.maxTokens,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data[0].generated_text;
  }
}

// Utility function to create a default LLM node
export function createDefaultLLMNode(type: 'openai' | 'huggingface'): Omit<LLMNode, 'id'> {
  return {
    type,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
    config: {
      model: type === 'openai' ? 'gpt-3.5-turbo' : 'gpt2',
      temperature: 0.7,
      maxTokens: 1000,
    },
    status: 'idle',
  };
} 