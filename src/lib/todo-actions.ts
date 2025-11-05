import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { todoStore } from './todo-store'
import type { QueryClient } from '@tanstack/react-query'
import type { Todo } from '@/data/todo-data'
import {
  deleteTodo,
  fetchTodoById,
  fetchTodos,
  updateTodo,
} from '@/data/todo-data'

export const todosQueryOptions = () =>
  queryOptions({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    staleTime: 1000 * 60 * 60,
  })

export async function loadTodos(queryClient: QueryClient) {
  todoStore.setState((s) => ({ ...s, isLoading: true, error: null }))

  try {
    const todos = await queryClient.fetchQuery(todosQueryOptions())
    todoStore.setState((s) => ({ ...s, todos, isLoading: false, error: null }))
  } catch (e: any) {
    todoStore.setState((s) => ({ ...s, isLoading: false, error: e.message }))
  }
}

export async function loadTodosSSR(queryClient: QueryClient) {
  try {
    const todos = await queryClient.ensureQueryData(todosQueryOptions())
    todoStore.setState((s) => ({
      ...s,
      todos,
      isLoading: false,
      error: null,
    }))
  } catch (e: any) {
    todoStore.setState((s) => ({
      ...s,
      isLoading: false,
      error: e.message ?? 'Failed to load todos',
    }))
  }
}

export function useDeleteTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const success = await deleteTodo(id)
      if (!success) throw new Error('Failed to delete todo')
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: (err) => {
      console.error('Delete failed:', err)
    },
  })
}

export function useUpdateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const updatedTodo = await updateTodo(id, data)
      return updatedTodo
    },
    onSuccess: (updatedTodo) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      queryClient.setQueryData(['todo', updatedTodo?.id], updatedTodo)
    },
    onError: (err) => {
      console.error('Update failed:', err)
    },
  })
}

export function useLoadTodoById(id: number) {
  const queryClient = useQueryClient()

  return useQuery<Todo>({
    queryKey: ['todoById', id],
    queryFn: async () => {
      const cached = queryClient.getQueryData<Todo>(['todo', id])
      if (cached) return cached

      const todo = await fetchTodoById(id)

      if (!todo) throw new Response('Not Found', { status: 404 })

      queryClient.setQueryData(['todo', id], todo)

      return todo
    },
  })
}
