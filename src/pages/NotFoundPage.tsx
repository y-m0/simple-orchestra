import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className="max-w-md mx-auto text-center py-12">
      <h1 className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary inline-flex items-center">
        <Home size={18} className="mr-2" />
        Back to Home
      </Link>
    </div>
  )
}

export default NotFoundPage