import { Server, Code, Database, Lock } from 'lucide-react'

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">About DataSummarizationAgent</h1>
      
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
        <p className="mb-4">
          The DataSummarizationAgent is an A2A-compliant service that provides text summarization capabilities. 
          Built with FastAPI and designed for deployment on Google Cloud Run, it offers a simple yet powerful 
          way to extract the most important information from any text.
        </p>
        <p>
          This frontend provides a user-friendly interface to interact with the agent's API, making it easy 
          to summarize documents, articles, or any text content.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <Server className="text-primary-500 mr-3" size={24} />
            <h2 className="text-xl font-semibold">A2A Compliance</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            The agent follows the Agent-to-Agent (A2A) protocol, allowing it to communicate seamlessly with other 
            agents in a standardized way. This enables integration into larger agent ecosystems and workflows.
          </p>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <Code className="text-primary-500 mr-3" size={24} />
            <h2 className="text-xl font-semibold">Technology Stack</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Backend: Python, FastAPI, Pydantic<br />
            Frontend: React, TypeScript, Tailwind CSS<br />
            Deployment: Docker, Google Cloud Run
          </p>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <Database className="text-primary-500 mr-3" size={24} />
            <h2 className="text-xl font-semibold">Summarization Logic</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            The current implementation uses a simple heuristic that extracts the first two sentences of the text.
            Future versions will integrate more sophisticated NLP models for improved summarization quality.
          </p>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <Lock className="text-primary-500 mr-3" size={24} />
            <h2 className="text-xl font-semibold">Security & Privacy</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            The agent is designed with security in mind, including OAuth 2.0 authentication support and 
            comprehensive input validation. Your data is processed securely and not stored beyond the 
            request lifecycle.
          </p>
        </div>
      </div>
      
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">API Documentation</h2>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mb-4 overflow-x-auto">
          <pre className="text-sm">
{`POST /tasks/summarize_text

{
  "task_id": "unique-task-id",
  "payload": {
    "text_input": "Text to be summarized."
  }
}

Response:

{
  "task_id": "unique-task-id",
  "status": "completed",
  "result": {
    "summary_output": "Summary of the text."
  }
}`}
          </pre>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          The API follows the A2A protocol, making it compatible with other A2A-compliant services.
          For more details, refer to the <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">full API documentation</a>.
        </p>
      </div>
    </div>
  )
}

export default AboutPage