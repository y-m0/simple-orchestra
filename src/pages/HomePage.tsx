import { Link } from 'react-router-dom'
import { FileText, Zap, Server } from 'lucide-react'

const HomePage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-600 dark:text-primary-400">
          DataSummarizationAgent
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Quickly summarize any text with our A2A-compliant agent
        </p>
        <Link
          to="/summarize"
          className="btn btn-primary text-lg px-6 py-3"
        >
          Try It Now
        </Link>
      </section>

      <section className="py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card p-6 text-center">
            <div className="flex justify-center mb-4">
              <FileText size={48} className="text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Input Your Text</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Paste any text you want to summarize into our simple interface.
            </p>
          </div>
          
          <div className="card p-6 text-center">
            <div className="flex justify-center mb-4">
              <Zap size={48} className="text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Process with AI</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our agent processes your text using advanced summarization techniques.
            </p>
          </div>
          
          <div className="card p-6 text-center">
            <div className="flex justify-center mb-4">
              <Server size={48} className="text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Your Summary</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Receive a concise summary that captures the key points of your text.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="card p-8">
          <h2 className="text-2xl font-bold mb-4">About the Agent</h2>
          <p className="mb-4">
            The DataSummarizationAgent is an A2A-compliant service that provides text summarization capabilities. 
            Built with FastAPI and designed for deployment on Google Cloud Run, it offers a simple yet powerful 
            way to extract the most important information from any text.
          </p>
          <p className="mb-4">
            This frontend provides a user-friendly interface to interact with the agent's API, making it easy 
            to summarize documents, articles, or any text content.
          </p>
          <div className="mt-6">
            <Link to="/about" className="text-primary-600 dark:text-primary-400 hover:underline">
              Learn more about the technology →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage