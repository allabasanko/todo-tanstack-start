import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { useForm } from '@tanstack/react-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { fetchTodoById } from '@/data/todo-data'
import { useUpdateTodo } from '@/lib/todo-actions'

export const Route = createFileRoute('/todos/$todoId/edit')({
  component: EditTodoPage,
})

function EditTodoPage() {
  const { todoId } = Route.useParams()
  const id = Number(todoId)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    data: todo,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['todo', id],
    queryFn: () => fetchTodoById(id),
  })

  const mutation = useUpdateTodo()

  const form = useForm({
    defaultValues: {
      title: todo?.title ?? '',
      content: todo?.content ?? '',
      status: todo?.status ?? 'pending',
    },
    onSubmit: ({ value }) => {
      mutation.mutate(
        { id, data: value },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todo', id] })
            queryClient.invalidateQueries({ queryKey: ['todos'] })
            navigate({ to: '/todos' })
          },
        },
      )
      navigate({ to: '/todos' })
    },
  })

  if (todo && form.state.values.title === '') {
    form.update({
      defaultValues: {
        title: todo.title,
        content: todo.content,
        status: todo.status,
      },
    })
  }

  if (isLoading) return <div className="p-8">Loading...</div>
  if (isError || !todo) return <div className="p-8">Todo not found</div>

  return (
    <Card className="shadow-md max-w-xl mx-auto mt-8 border-t pt-6">
      <CardHeader>
        <CardTitle>Edit Todo #{todo.id}</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field
            name="title"
            children={(field) => (
              <div className="space-y-1">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                />
              </div>
            )}
          />

          <form.Field
            name="content"
            children={(field) => (
              <div className="space-y-1">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                />
              </div>
            )}
          />

          <form.Field
            name="status"
            children={(field) => (
              <div className="space-y-1">
                <Label>Status</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(
                      v as 'pending' | 'in-progress' | 'completed',
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="submit" variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
