import { RefreshCw } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: number
  className?: string
}

const LoadingSpinner = ({ size = 24, className = '' }: LoadingSpinnerProps) => {
  return (
    <RefreshCw 
      size={size} 
      className={`animate-spin ${className}`} 
    />
  )
}

export default LoadingSpinner