import { useState } from 'react'
import { FileText, Copy, Check, RefreshCw } from 'lucide-react'
import { summarizeText } from '../services/api'

const SummarizationPage = () => {
  const [inputText, setInputText] = useState('')
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputText.trim()) {
      setError('Please enter some text to summarize')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const result = await summarizeText(inputText)
      setSummary(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while summarizing the text')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setInputText('')
    setSummary('')
    setError('')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Text Summarization</h1>
      
      <div className="card p-6 mb-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="inputText" className="block text-sm font-medium mb-2">
              Enter Text to Summarize
            </label>
            <textarea
              id="inputText"
              className="textarea min-h-[200px]"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your text here..."
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button 
              type="submit" 
              className="btn btn-primary flex items-center"
              disabled={isLoading || !inputText.trim()}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={18} className="mr-2 animate-spin" />
                  Summarizing...
                </>
              ) : (
                <>
                  <FileText size={18} className="mr-2" />
                  Summarize
                </>
              )}
            </button>
            
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md">
              {error}
            </div>
          )}
        </form>
      </div>
      
      {summary && (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Summary</h2>
            <button 
              onClick={handleCopy} 
              className="btn btn-outline flex items-center"
              aria-label="Copy summary to clipboard"
            >
              {copied ? (
                <>
                  <Check size={18} className="mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={18} className="mr-2" />
                  Copy
                </>
              )}
            </button>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
            <p>{summary}</p>
          </div>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md text-sm text-gray-600 dark:text-gray-400">
        <p className="font-medium mb-2">Tips for better summaries:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Use clear, well-structured text for better results</li>
          <li>Longer texts provide more context for summarization</li>
          <li>The current algorithm extracts the first two sentences as a simple summary</li>
          <li>Future versions will use more sophisticated AI models</li>
        </ul>
      </div>
    </div>
  )
}

export default SummarizationPage