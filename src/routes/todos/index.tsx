import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { SortingState } from '@tanstack/react-table'
import type { Todo } from '@/data/todo-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  loadTodosSSR,
  todosQueryOptions,
  useDeleteTodo,
} from '@/lib/todo-actions'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/todos/')({
  component: TodosPage,
  loader: async ({ context }) => {
    const { queryClient } = context
    await loadTodosSSR(queryClient)
    return null
  },
})

function TodosPage() {
  const { data: todos, error } = useSuspenseQuery(todosQueryOptions())

  const deleteMutation = useDeleteTodo()

  const [sorting, setSorting] = useState<SortingState>([])

  const navigate = Route.useNavigate()

  const columnHelper = createColumnHelper<Todo>()

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
    }),
    columnHelper.accessor('title', {
      header: 'Title',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue()
        return (
          <Badge
            variant={
              status === 'completed'
                ? 'default'
                : status === 'in-progress'
                  ? 'secondary'
                  : 'outline'
            }
          >
            {status}
          </Badge>
        )
      },
    }),
    columnHelper.accessor('startDate', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 font-semibold"
        >
          Start Date
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ getValue }) => new Date(getValue()).toLocaleDateString('en-US'),
    }),
    columnHelper.accessor('endDate', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 font-semibold"
        >
          End Date
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ getValue }) => new Date(getValue()).toLocaleDateString('en-US'),
    }),

    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2 justify-start items-center">
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              deleteMutation.mutate(row.original.id)
            }}
          >
            Delete
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              navigate({
                to: '/todos/$todoId/edit',
                params: { todoId: row.original.id.toString() },
              })
            }}
          >
            Edit
          </Button>
        </div>
      ),
    }),
  ]

  const table = useReactTable({
    data: todos,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (error) return <div>Error</div>

  return (
    <div className="p-8 mx-auto">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Todo List</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => {
                    console.log(row.original.id, 'row id')
                    navigate({
                      to: '/todos/$todoId',
                      params: { todoId: row.original.id.toString() },
                    })
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
