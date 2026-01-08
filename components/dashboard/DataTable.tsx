'use client'

import React, { useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowUpDown, ChevronDown } from 'lucide-react'
import { usePaginatedSorting } from '@/hooks/usePagination'

export interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  width?: string
  render?: (value: any, item: T, index: number) => React.ReactNode
}

interface DataTableProps<T extends { id?: string; [key: string]: any }> {
  data: T[]
  columns: Column<T>[]
  pageSize?: number
  onRowClick?: (item: T, index: number) => void
  selectable?: boolean
  selectedRows?: string[]
  onSelectRow?: (id: string) => void
  loading?: boolean
  emptyMessage?: string
}

/**
 * Reusable data table component with pagination, sorting, and row selection
 */
export function DataTable<T extends { id?: string; [key: string]: any }>({
  data,
  columns,
  pageSize = 10,
  onRowClick,
  selectable = false,
  selectedRows = [],
  onSelectRow,
  loading = false,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  const pagination = usePaginatedSorting(data, { pageSize })

  const handleSort = (key: keyof T) => {
    const column = columns.find((c) => c.key === key)
    if (column?.sortable) {
      pagination.toggleSort(String(key))
    }
  }

  const handleSelectAll = () => {
    if (selectedRows.length === pagination.currentItems.length) {
      // Deselect all
      pagination.currentItems.forEach((item) => {
        if (item.id && selectedRows.includes(item.id)) {
          onSelectRow?.(item.id)
        }
      })
    } else {
      // Select all
      pagination.currentItems.forEach((item) => {
        if (item.id && !selectedRows.includes(item.id)) {
          onSelectRow?.(item.id)
        }
      })
    }
  }

  const isAllSelected =
    pagination.currentItems.length > 0 &&
    pagination.currentItems.every(
      (item) => item.id && selectedRows.includes(item.id)
    )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin">
          <ChevronDown className="w-8 h-8 text-primary" />
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  style={{ width: column.width }}
                  className={column.sortable ? 'cursor-pointer hover:bg-muted' : ''}
                >
                  <div
                    className="flex items-center gap-2"
                    onClick={() => handleSort(column.key)}
                  >
                    <span>{column.label}</span>
                    {column.sortable && (
                      <ArrowUpDown className="w-4 h-4 opacity-50" />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagination.currentItems.map((item, index) => (
              <TableRow
                key={item.id || index}
                className={`hover:bg-muted/50 transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRowClick?.(item, index)}
              >
                {selectable && (
                  <TableCell className="w-12">
                    <Checkbox
                      checked={item.id ? selectedRows.includes(item.id) : false}
                      onChange={() => item.id && onSelectRow?.(item.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={String(column.key)}>
                    {column.render
                      ? column.render(item[column.key], item, index)
                      : String(item[column.key] || '-')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {pagination.currentItems.length > 0 ? (pagination.currentPage - 1) * pageSize + 1 : 0} to{' '}
            {Math.min(pagination.currentPage * pageSize, pagination.totalItems)} of{' '}
            {pagination.totalItems} items
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => pagination.previousPage()}
                  className={
                    !pagination.hasPreviousPage
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>

              {/* Show first page */}
              {pagination.currentPage > 2 && (
                <>
                  <PaginationItem>
                    <PaginationLink onClick={() => pagination.goToPage(1)}>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {pagination.currentPage > 3 && <PaginationEllipsis />}
                </>
              )}

              {/* Show current and surrounding pages */}
              {pagination.currentPage > 1 && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => pagination.previousPage()}
                  >
                    {pagination.currentPage - 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationLink isActive>
                  {pagination.currentPage}
                </PaginationLink>
              </PaginationItem>

              {pagination.currentPage < pagination.totalPages && (
                <PaginationItem>
                  <PaginationLink onClick={() => pagination.nextPage()}>
                    {pagination.currentPage + 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Show last page */}
              {pagination.currentPage < pagination.totalPages - 1 && (
                <>
                  {pagination.currentPage < pagination.totalPages - 2 && (
                    <PaginationEllipsis />
                  )}
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => pagination.goToPage(pagination.totalPages)}
                    >
                      {pagination.totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => pagination.nextPage()}
                  className={
                    !pagination.hasNextPage
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

export default DataTable
