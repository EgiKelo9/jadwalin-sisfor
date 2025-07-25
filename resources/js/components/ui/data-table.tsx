"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link, router } from '@inertiajs/react';
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleX,
  Settings2,
  Plus,
  Filter,
  ChevronDown,
  ChevronDownIcon,
  History,
  FileText,
  Download,
} from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  ColumnDef,
  flexRender,
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  useReactTable,
  Column,
  FilterFn,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

// Type definition for column filter configuration
export interface ColumnFilterConfig {
  columnId: string
  label: string
  type: 'select' | 'multiselect' | 'text' | 'date'
  options?: string[] // For select/multiselect types
  placeholder?: string
}

interface DataTableProps<TData extends { id: string | number }, TValue> {
  title: string
  href: string
  showActiveTab?: boolean
  activeTab?: string[]
  defaultTab?: string
  showSearch?: boolean
  searchableColumns?: string[]
  showCreateButton?: boolean
  showColumnFilter?: boolean
  showDataFilter?: boolean
  showHistoryButton?: boolean
  showTopActionButton?: boolean
  topActionButtonLabel?: string
  topActionButtonHref?: string
  showPdfExport?: boolean
  pdfExportHandler?: (
    data: TData[],
    columnFilters?: ColumnFiltersState,
    globalFilter?: string
  ) => void;
  columnFilters?: ColumnFilterConfig[]
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

// Component for individual column filter
function ColumnFilter<TData>({
  column,
  config
}: {
  column: Column<TData, unknown>
  config: ColumnFilterConfig
}) {
  const [selectedValues, setSelectedValues] = React.useState<string[]>([])

  // Get unique values from the column data for select options
  const uniqueValues = React.useMemo(() => {
    if (config.options) {
      return config.options
    }

    // Extract unique values from column data
    const values = column.getFacetedUniqueValues()
    return Array.from(values.keys()).filter(Boolean).sort()
  }, [column, config.options])

  // Handle filter changes based on filter type
  const handleFilterChange = (values: string[]) => {
    setSelectedValues(values)

    if (values.length === 0) {
      column.setFilterValue(undefined)
    } else {
      column.setFilterValue(values[0])
    }
  }

  // Set the appropriate filter function based on config type
  React.useEffect(() => {
    if (config.type === 'text') {
      (column.columnDef as any).filterFn = 'textContains'
    } else if (config.type === 'date') {
      (column.columnDef as any).filterFn = 'dateEquals'
    } else {
      (column.columnDef as any).filterFn = 'exactMatch'
    }
  }, [column, config.type])

  // Render different filter types
  if (config.type === 'text') {
    return (
      <div className="flex flex-col gap-2">
        <Input
          placeholder={config.placeholder || `Filter ${config.label}...`}
          value={(column.getFilterValue() as string) ?? ""}
          onChange={(event) => column.setFilterValue(event.target.value)}
          className="text-sm"
        />
      </div>
    )
  }

  if (config.type === 'date') {
    const [date, setDate] = React.useState<string>('')

    // Apply date filter when date changes
    React.useEffect(() => {
      if (date) {
        column.setFilterValue(date)
      } else {
        column.setFilterValue(undefined)
      }
    }, [date, column])

    return (
      <div className="flex flex-col gap-2">
        <Input
          type="date"
          value={date}
          onChange={(event) => {
            setDate(event.target.value)
          }}
          className="text-sm w-48"
          placeholder="Pilih Tanggal"
        />
        {date && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDate('')}
            className="h-6 text-xs"
          >
            Clear Filter
          </Button>
        )}
      </div>
    )
  }

  if (config.type === 'select') {
    return (
      <div className="flex flex-col gap-2">
        <Select
          value={selectedValues[0] || ""}
          onValueChange={(value) => {
            if (value === "all") {
              handleFilterChange([])
            } else {
              handleFilterChange([value])
            }
          }}
        >
          <SelectTrigger className="text-sm capitalize">
            <SelectValue placeholder={`Pilih ${config.label}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            {uniqueValues.map((value) => (
              <SelectItem key={value} value={String(value)} className="capitalize">
                {String(value).replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }
}

export function DataTable<TData extends { id: string | number }, TValue>({
  title,
  href,
  showActiveTab = false,
  activeTab,
  defaultTab,
  showSearch = true,
  showCreateButton = true,
  showColumnFilter = true,
  showDataFilter = true,
  showHistoryButton = false,
  showTopActionButton = false,
  topActionButtonLabel,
  topActionButtonHref,
  showPdfExport = false,
  pdfExportHandler,
  columnFilters = [], // New prop with default empty array
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFiltersState, setColumnFilters] = React.useState<ColumnFiltersState>([])

  // Define custom filter functions
  const exactMatch: FilterFn<TData> = (row, columnId, filterValue) => {
    const value = row.getValue(columnId)
    if (Array.isArray(filterValue)) {
      // For multiselect: check if value is in the array
      return filterValue.includes(String(value))
    }
    // For single select: exact match
    return String(value) === String(filterValue)
  }

  const textContains: FilterFn<TData> = (row, columnId, filterValue) => {
    const value = String(row.getValue(columnId) || '')
    return value.toLowerCase().includes(String(filterValue).toLowerCase())
  }

  const dateEquals: FilterFn<TData> = (row, columnId, filterValue) => {
    const rowValue = row.getValue(columnId)
    if (!rowValue || !filterValue) return true

    // Convert row value to date string (assuming it's in Y-m-d format)
    const rowDate = new Date(rowValue as string).toISOString().split('T')[0]
    const filterDate = String(filterValue)

    return rowDate === filterDate
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    // Enable faceting for column filters
    getFacetedUniqueValues: (table, columnId) => () => {
      const column = table.getColumn(columnId)
      if (!column) return new Map()

      const uniqueValues = new Map()
      table.getPreFilteredRowModel().flatRows.forEach((row) => {
        const value = row.getValue(columnId)
        if (value != null) {
          uniqueValues.set(value, (uniqueValues.get(value) ?? 0) + 1)
        }
      })
      return uniqueValues
    },
    // Add custom filter functions for exact matching
    filterFns: {
      exactMatch,
      textContains,
      dateEquals,
    },
    state: {
      sorting,
      columnFilters: columnFiltersState,
    },
  })

  // Get active filters for display
  const activeFilters = columnFiltersState.filter(filter => filter.value !== undefined && filter.value !== "")

  return (
    <div className="flex flex-col w-full gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* title */}
        <h1 className='text-xl font-semibold'>{title}</h1>
        <div className="flex items-center justify-center max-w-lg mb-2 gap-4">
          {/* search bar */}
          {showSearch && (
            <div className="flex justify-end items-center w-full">
              <Input
                placeholder={`Cari data...`}
                value={(table.getState().globalFilter as string) ?? ""}
                onChange={(event) => {
                  table.setGlobalFilter(event.target.value);
                }}
                className="text-sm"
              />
            </div>
          )}
          {/* data filter */}
          {showDataFilter && columnFilters.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(
                buttonVariants({ variant: "outline", size: "sm" }), "ml-auto h-9")}>
                <Filter />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter Data</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="flex flex-col gap-1">
                  {columnFilters.map((config) => {
                    const column = table.getColumn(config.columnId)
                    if (!column) return null
                    return (
                      <div className="flex flex-col gap-1" key={config.columnId}>
                        <ColumnFilter column={column} config={config} />
                      </div>
                    )
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {/* history button */}
          {showHistoryButton && (
            <Link href={`${href}/riwayat`}>
              <Button variant="outline" className="ml-auto w-9">
                <History />
              </Button>
            </Link>
          )}
          {/* PDF export button */}
          {showPdfExport && pdfExportHandler && (
              <Button
                variant="outline"
                size="sm"
                className="h-9"
                onClick={() => {
                  const activeColumnFilters = table.getState().columnFilters;
                  const globalFilter = table.getState().globalFilter;
                  pdfExportHandler(
                    table.getFilteredRowModel().rows.map(row => row.original),
                    activeColumnFilters,
                    globalFilter
                  )
                }}
              ><Download className="h-4 w-4"/>
              </Button>
          )}
          {/* column filter */}
          {showColumnFilter && (
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(
                buttonVariants({ variant: "outline", size: "sm" }), "ml-auto h-9")}>
                <Settings2 />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuLabel>Kolom</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" && column.getCanHide()
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id.replace('_id', '').replace('_', ' ')}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {/* create button */}
          {showTopActionButton && (
            <Button variant="outline" asChild>
              <Link href={`${href}/${topActionButtonHref}`}>{topActionButtonLabel}</Link>
            </Button>
          )}
          {showCreateButton && (
            <Button variant="primary" asChild>
              <Link href={`${href}/buat`}><Plus />Buat</Link>
            </Button>
          )}
        </div>
      </div>
      {/* active tab */}
      {(showActiveTab && activeTab) && (
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center gap-2 py-2 px-2 bg-muted/50 rounded-md">
            {activeTab.map((tab) => {
              const urlParams = new URLSearchParams(window.location.search);
              const currentActiveTab = urlParams.get('tabAktif') || defaultTab;
              return (
                <Button
                  key={tab}
                  variant={tab === currentActiveTab ? "secondary" : "ghost"}
                  size="lg"
                  className="h-8 px-4 capitalize"
                  asChild
                >
                  <Link href={`${href}?tabAktif=${tab}`}>{tab}</Link>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* table */}
      <div className="rounded-md border">
        <Table>
          {/* Active filters display */}
          {(table.getState().globalFilter || activeFilters.length > 0) && (
            <TableHeader>
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <div className="flex items-center gap-2 py-1 px-4 flex-wrap">
                    <span className="text-sm font-medium">Filter aktif:</span>
                    {table.getState().globalFilter && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => { table.setGlobalFilter(""); }}
                      >
                        Pencarian: {table.getState().globalFilter as string}
                        <CircleX className="ml-2 size-4" />
                      </Button>
                    )}
                    {activeFilters.map((filter) => {
                      const config = columnFilters.find(c => c.columnId === filter.id)
                      const column = table.getColumn(filter.id)
                      if (!config || !column) return null

                      return (
                        <Button
                          key={filter.id}
                          variant="secondary"
                          size="sm"
                          className="h-7 px-2"
                          onClick={() => column.setFilterValue(undefined)}
                        >
                          {config.label}: {
                            Array.isArray(filter.value)
                              ? `${filter.value.length} dipilih`
                              : String(filter.value)
                          }
                          <CircleX className="ml-2 size-4" />
                        </Button>
                      )
                    })}
                  </div>
                </TableCell>
              </TableRow>
            </TableHeader>
          )}

          <TableHeader>
            {/* table header */}
            {table.getRowModel().rows?.length ? (
              table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="py-4 pl-4">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))
            ) : null}
          </TableHeader>
          {/* table body */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="truncate max-w-96 pl-4">
                      {/* Only wrap non-action cells with Link */}
                      {cell.column.id === "actions" || cell.column.id === "select" ? (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      ) : (
                        <Link href={`${href}/${row.original.id}`} key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Link>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <CircleX className="size-8 text-primary/70" />
                    <p>Tidak ada data yang ditemukan.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* pagination */}
      {table.getRowCount() > 0 ? (
        <div className="flex items-center mt-2 justify-between px-2">
          {/* rows selected */}
          <div className="text-muted-foreground text-sm">
            {table.getFilteredSelectedRowModel().rows.length} dari{" "}
            {table.getFilteredRowModel().rows.length} terpilih.
          </div>
          {/* rows number per page */}
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium hidden lg:block">per halaman</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 min-w-[70px] w-auto">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 25, 50, 100].map((pageSize) => (
                  <SelectItem
                    key={pageSize}
                    value={`${pageSize}`}
                  >
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* page information */}
            <div className="hidden w-auto md:flex md:items-center md:justify-center text-sm font-medium">
              Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
              {table.getPageCount()}
            </div>
            {/* next previous button */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="hidden size-8 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ke Halaman Pertama</span>
                <ChevronsLeft />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ke Halaman Sebelumnya</span>
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ke Halaman Selanjutnya</span>
                <ChevronRight />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hidden size-8 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ke Halaman Terakhir</span>
                <ChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
