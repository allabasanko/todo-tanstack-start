import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="p-6 shadow-md max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-red-600">
            404 — Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            The page you’re looking for doesn’t exist or was moved.
          </p>
          <Button onClick={() => navigate({ to: '/' })}>Go back home</Button>
        </CardContent>
      </Card>
    </div>
  )
}
