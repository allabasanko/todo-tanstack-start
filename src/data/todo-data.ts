// src/data/todo-data.ts
import { faker } from '@faker-js/faker'

export type Todo = {
  id: number
  title: string
  content: string
  status: 'pending' | 'in-progress' | 'completed'
  startDate: Date
  endDate: Date
}

let todos: Array<Todo> = []

function generateTodos(count = 15): Array<Todo> {
  return Array.from({ length: count }, (_, i) => {
    const startDate = faker.date.recent({ days: 10 })
    const endDate = faker.date.soon({ days: 10, refDate: startDate })

    return {
      id: i + 1,
      title: faker.hacker.phrase(),
      content: faker.lorem.sentences({ min: 1, max: 3 }),
      status: faker.helpers.arrayElement([
        'pending',
        'in-progress',
        'completed',
      ]),
      startDate,
      endDate,
    }
  })
}

if (todos.length === 0) {
  todos = generateTodos()
}

export async function fetchTodos(): Promise<Array<Todo>> {
  await delay()
  return [...todos]
}

export async function fetchTodoById(id: number): Promise<Todo | undefined> {
  await delay()
  return todos.find((t) => t.id === id)
}

export async function createTodo(newTodo: Omit<Todo, 'id'>): Promise<Todo> {
  await delay()
  const todo: Todo = { ...newTodo, id: Date.now() }
  todos.push(todo)
  return todo
}

export async function updateTodo(
  id: number,
  updates: Partial<Todo>,
): Promise<Todo | undefined> {
  await delay()
  const index = todos.findIndex((t) => t.id === id)
  if (index === -1) return undefined
  todos[index] = { ...todos[index], ...updates }
  return todos[index]
}

export async function deleteTodo(id: number): Promise<boolean> {
  await delay()
  const initialLength = todos.length
  todos = todos.filter((t) => t.id !== id)
  return todos.length < initialLength
}

function delay(ms = 400) {
  return new Promise((r) => setTimeout(r, ms))
}
