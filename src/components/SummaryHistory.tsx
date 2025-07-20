import { useState, useEffect } from 'react'
import { Clock, Trash2 } from 'lucide-react'

interface SummaryItem {
  id: string
  originalText: string
  summary: string
  timestamp: string
}

const SummaryHistory = () => {
  const [history, setHistory] = useState<SummaryItem[]>([])

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('summaryHistory')
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error('Failed to parse summary history:', error)
      }
    }
  }, [])

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('summaryHistory')
  }

  const removeItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id)
    setHistory(updatedHistory)
    localStorage.setItem('summaryHistory', JSON.stringify(updatedHistory))
  }

  if (history.length === 0) {
    return null
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Summaries</h2>
        <button
          onClick={clearHistory}
          className="text-sm text-red-600 dark:text-red-400 hover:underline flex items-center"
        >
          <Trash2 size={16} className="mr-1" />
          Clear History
        </button>
      </div>
      
      <div className="space-y-4">
        {history.map((item) => (
          <div key={item.id} className="card p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">Summary</h3>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center mr-3">
                  <Clock size={12} className="mr-1" />
                  {new Date(item.timestamp).toLocaleString()}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                  aria-label="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md mb-2">
              <p className="text-sm">{item.summary}</p>
            </div>
            <details className="text-xs">
              <summary className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                Show original text
              </summary>
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-gray-600 dark:text-gray-400">{item.originalText}</p>
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SummaryHistory