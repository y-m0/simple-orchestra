import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

interface AuthWrapperProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function AuthWrapper({ children, requireAuth = true }: AuthWrapperProps) {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && requireAuth && !isAuthenticated) {
      navigate('/login', { replace: true })
    }
  }, [isAuthenticated, loading, navigate, requireAuth])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-4 w-1/2 mx-auto mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return null // Will be redirected by useEffect
  }

  return <>{children}</>
} 