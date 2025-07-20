import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface SummaryResultProps {
  summary: string
}

const SummaryResult = ({ summary }: SummaryResultProps) => {
  const [copied, setCopied] = useState(false)

  if (!summary) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Summary</h2>
        <button 
          onClick={handleCopy} 
          className="btn btn-outline flex items-center text-sm"
          aria-label="Copy summary to clipboard"
        >
          {copied ? (
            <>
              <Check size={16} className="mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy size={16} className="mr-2" />
              Copy
            </>
          )}
        </button>
      </div>
      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
        <p>{summary}</p>
      </div>
    </div>
  )
}

export default SummaryResult