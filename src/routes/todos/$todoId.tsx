import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useDeleteTodo, useLoadTodoById } from '@/lib/todo-actions'
import { NotFound } from '@/components/NotFound'

export const Route = createFileRoute('/todos/$todoId')({
  component: TodoDetailPage,
  errorComponent: () => <NotFound />,
  notFoundComponent: () => <NotFound />,
})

function TodoDetailPage() {
  const { todoId } = Route.useParams()

  const id = Number(todoId)

  const navigate = useNavigate()

  const { data: todo, isLoading, isError, error } = useLoadTodoById(id)

  const deleteMutation = useDeleteTodo()

  if (isLoading) return <div className="p-8">Loading...</div>
  if (error instanceof Response && error.status === 404) {
    return <NotFound />
  }
  if (isError) return <div className="p-8">Error loading todo</div>

  const handleDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        navigate({ to: '/todos' })
      },
    })
  }

  return (
    <div className="p-8">
      <Button variant="link" onClick={() => navigate({ to: '/todos' })}>
        &larr; Back to Todos
      </Button>
      <Card className="shadow-md max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>{todo?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{todo?.content}</p>
          <Badge
            variant={
              todo?.status === 'completed'
                ? 'default'
                : todo?.status === 'in-progress'
                  ? 'secondary'
                  : 'outline'
            }
          >
            {todo?.status}
          </Badge>
          <p className="mt-4 text-sm text-gray-500">
            {(todo && new Date(todo.startDate).toLocaleDateString()) || '–'}
            {(todo && new Date(todo.endDate).toLocaleDateString()) || '–'}
          </p>
          <div className="flex gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => navigate({ to: `/todos/${id}/edit` })}
            >
              Update
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
      <Outlet />
    </div>
  )
}
