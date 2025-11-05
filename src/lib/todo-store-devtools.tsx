import { EventClient } from '@tanstack/devtools-event-client'
import { useEffect, useState } from 'react'
import { stats, todoStore } from './todo-store'

type EventMap = {
  'todo-store-devtools:state': {
    total: number
    completed: number
    pending: number
    inProgress: number
    isLoading: boolean
    error: string | null
  }
}

class StoreDevtoolsEventClient extends EventClient<EventMap> {
  constructor() {
    super({
      pluginId: 'todo-store-devtools',
    })
  }
}

const sdec = new StoreDevtoolsEventClient()

todoStore.subscribe(() => {
  sdec.emit('state', {
    total: stats.state.total,
    completed: stats.state.completed,
    pending: stats.state.pending,
    inProgress: stats.state.inProgress,
    isLoading: todoStore.state.isLoading,
    error: todoStore.state.error,
  })
})

console.log('Emit new state', {
  total: stats.state.total,
  completed: stats.state.completed,
  pending: stats.state.pending,
  inProgress: stats.state.inProgress,
  isLoading: todoStore.state.isLoading,
  error: todoStore.state.error,
})

function TodoDevtoolPanel() {
  const [state, setState] = useState<EventMap['todo-store-devtools:state']>(
    () => ({
      total: stats.state.total,
      completed: stats.state.completed,
      pending: stats.state.pending,
      inProgress: stats.state.inProgress,
      isLoading: todoStore.state.isLoading,
      error: todoStore.state.error,
    }),
  )

  useEffect(() => {
    return sdec.on('state', (e) => setState(e.payload))
  }, [])

  return (
    <div className="p-4 grid gap-3 grid-cols-[1fr_1fr] text-sm">
      <div className="font-bold text-gray-500">Total</div>
      <div>{state.total}</div>

      <div className="font-bold text-gray-500">Completed</div>
      <div>{state.completed}</div>

      <div className="font-bold text-gray-500">In Progress</div>
      <div>{state.inProgress}</div>

      <div className="font-bold text-gray-500">Pending</div>
      <div>{state.pending}</div>

      <div className="font-bold text-red-500">Loading</div>
      <div>{state.isLoading ? 'Yes' : 'No'}</div>

      <div className="font-bold text-gray-500">Error</div>
      <div>{state.error ?? '—'}</div>
    </div>
  )
}

export default {
  name: 'Todo Store',
  render: <TodoDevtoolPanel />,
}
