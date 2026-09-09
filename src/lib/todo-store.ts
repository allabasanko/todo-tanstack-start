import { Store, createAtom } from '@tanstack/store'
import { useSyncExternalStore } from 'react'
import type { Todo } from '@/data/todo-data'

export const todoStore = new Store({
  todos: [] as Array<Todo>,
  isLoading: false,
  error: null as string | null,
})

export const stats = createAtom({
  fn: () => {
    const todos = todoStore.state.todos
    return {
      total: todos.length,
      completed: todos.filter((t) => t.status === 'completed').length,
      pending: todos.filter((t) => t.status === 'pending').length,
      inProgress: todos.filter((t) => t.status === 'in-progress').length,
    }
  },
  deps: [todoStore],
})

export function useTodoStore() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const subscription = todoStore.subscribe(onStoreChange)
      return () => subscription.unsubscribe()
    },
    () => todoStore.state,
    () => todoStore.state,
  )
}
