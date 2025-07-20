import { Heart } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} DataSummarizationAgent UI
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              Made with <Heart size={16} className="mx-1 text-red-500" /> using React & FastAPI
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer