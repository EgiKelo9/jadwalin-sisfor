"use client"

import React, { FormEventHandler } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Button, buttonVariants } from "@/components/ui/button"
import { router } from "@inertiajs/react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useState } from 'react'
import { Switch } from "@/components/ui/switch"

import {
  ArrowUpDown,
  EllipsisVertical,
  LoaderCircle,
  Pencil,
  Trash2,
  Check,
  SendHorizonal,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"

export interface BaseEntity {
  id: number
  [key: string]: any
}

export interface DataColumnConfig {
  key: string
  header: string
  sortable?: boolean
  prefix?: string
  suffix?: string
  type: "text" | "date" | "time" | "image" | "currency" | "badge" | "list" | "custom"
  onClick?: (item: any) => any
  customRenderer?: (item: any) => React.ReactNode
}

export interface ActionConfig {
  basePath: string
  showEdit?: boolean
  showDelete?: boolean
  showSwitch?: boolean
  showActionButton?: boolean
  showMultipleButtons?: boolean
  editLabel?: string
  deleteLabel?: string
  switchLabel?: string
  switchKey?: string
  actionButtonLabel?: string
  actionButtonKey?: string
  actionButtonVariant?: string
  actionButtonValues?: any | any[]
  actionButtonPath?: string // Route for action button
  multipleButtonKeys?: string[] // Key to identify multiple action button
  multipleButtonLabels?: string[] // Label for multiple action button
  multipleButtonValues?: any[] // Values for multiple action button
  multipleButtonVariants?: string[] // Variant for multiple action button
  multipleButtonPaths?: string[] // Routes for multiple action buttons
  switchTrueValue?: any  // Value when switch is ON
  switchFalseValue?: any // Value when switch is OFF
  switchTrueLabel?: string // Label for true state
  switchFalseLabel?: string // Label for false state
  isValueSwitchable?: (value: any) => boolean // Function to check if value is switchable
  getSwitchChecked?: (item: BaseEntity) => boolean // Function to determine switch checked state
  getNextSwitchValue?: (currentValue: any) => any // Function to get next value when switch toggles
  onEdit?: (item: BaseEntity) => void
  onDelete?: (item: BaseEntity) => void
  onSwitch?: (item: BaseEntity, newValue: any) => void
  onAction?: (item: BaseEntity) => void // Callback for action button
}

export interface ColumnGeneratorConfig {
  dataColumns: DataColumnConfig[]
  actionConfig: ActionConfig
  showSelectColumn?: boolean
}

/**
 * Generator fungsi untuk membuat kolom tabel yang dapat digunakan kembali
 * 
 * @param config - Konfigurasi untuk membuat kolom
 * @returns Array definisi kolom untuk react-table
 */
export function createTableColumns<T extends BaseEntity>(
  config: ColumnGeneratorConfig
): ColumnDef<T>[] {
  const columns: ColumnDef<T>[] = []

  // Tambahkan kolom seleksi jika diminta
  if (config.showSelectColumn !== false) { // Default true
    columns.push({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    })
  }

  // Tambahkan kolom-kolom data
  config.dataColumns.forEach((columnConfig) => {
    // Helper function to get nested property values using dot notation
    const getNestedValue = (obj: any, path: string) => {
      return path.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : null
      }, obj)
    }

    const column: ColumnDef<T> = {
      accessorKey: columnConfig.key,
      header: columnConfig.sortable !== false ? // Default sortable
        ({ column }) => (
          <button
            onClick={() => {
              const currentSort = column.getIsSorted()
              if (currentSort === false) {
                column.toggleSorting(false) // set to asc
              } else if (currentSort === "asc") {
                column.toggleSorting(true) // set to desc
              } else {
                column.clearSorting() // clear sorting
              }
            }}
            className="flex items-center hover:text-primary transition-colors"
          >
            {columnConfig.header}
            <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() === false ? 'opacity-50' : ''}`} />
          </button>
        ) :
        columnConfig.header,
      cell: ({ row }) => {
        const value = getNestedValue(row.original, columnConfig.key);
        switch (columnConfig.type) {
          case "text":
            return (
              <span className="truncate max-w-96">
                {columnConfig.prefix && <span>{columnConfig.prefix}</span>}
                {value}
                {columnConfig.suffix && <span>{columnConfig.suffix}</span>}
              </span>
            );
          case "date":
            const dateValue = new Date(value);
            if (!isNaN(dateValue.getTime())) {
              const day = dateValue.getDate().toString().padStart(2, '0');
              const month = (dateValue.getMonth() + 1).toString().padStart(2, '0');
              const year = dateValue.getFullYear();
              return (
                <span>
                  {`${day}-${month}-${year}`}
                </span>
              );
            }
            return <span>{String(value)}</span>;
          case "time":
            const timeValue = value as Date | string;
            const dateTime = new Date(timeValue);
            if (!isNaN(dateTime.getTime())) {
              return (
                <span>
                  {`${dateTime.getHours().toString()}:${dateTime.getMinutes().toString()}`} WITA
                </span>
              )
            }
            return <span>{String(timeValue)} WITA</span>;
          case "image":
            const imagePath = value as string
            return (
              <div className="w-10">
                <AspectRatio ratio={1}>
                  <img
                    src={imagePath ? `${window.location.origin}/storage/${imagePath}` : `${window.location.origin}/images/blank-profile-picture.webp`}
                    alt={`Image for ${row.getValue('nama')}`}
                    className="h-full w-full rounded-md object-cover"
                  />
                </AspectRatio>
              </div>
            );
          case "currency":
            const price = value as number
            return (
              <span className="text-right">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                }).format(price)}
              </span>
            );
          case "badge":
            const status = value as string
            return (
              <Badge
                variant={
                  ["tersedia", "aktif", "selesai", "success", "layak", "diterima"].includes(status?.toLowerCase())
                    ? "primary"
                    : ["tidak tersedia", "nonaktif", "batal", "gagal", "error", "tidak_layak", "ditolak"].includes(status?.toLowerCase())
                      ? "destructive"
                      : "warning"
                }
                className="capitalize"
              >
                {status.replace('_', ' ')}
              </Badge>
            );
          case "list":
            const items = value;
            return (
              <span>
                {Array.isArray(items)
                  ? items.map((item, i) =>
                    typeof item === 'object' && item !== null
                      ? (item.nama) + (item.pivot ? ` (${item.pivot.jumlah}x)` : '')
                      : String(item)
                  ).join(', ')
                  : typeof items === 'object' && items !== null
                    ? Object.entries(items).map(([key, value]) =>
                      `${key}: ${String(value)}`
                    ).join(', ')
                    : String(items)
                }
              </span>
            );
          case "custom":
            if (columnConfig.customRenderer) {
              return columnConfig.customRenderer(row.original);
            }
            return <span>{String(value)}</span>;
        }
      }
    }
    columns.push(column)
  })

  // Tambahkan kolom aksi
  const { actionConfig } = config
  if (actionConfig.showEdit !== false || actionConfig.showDelete !== false || actionConfig.showSwitch !== false || actionConfig.showActionButton !== false || actionConfig.showMultipleButtons !== false) {
    columns.push({
      id: "actions",
      cell: ({ row }) => {
        const item = row.original
        const [deleting, setDeleting] = useState(false)
        const [processing, setProcessing] = useState(false)
        const [showDeleteDialog, setShowDeleteDialog] = useState(false)

        // Handler untuk edit
        const handleEdit = () => {
          if (actionConfig.onEdit) {
            actionConfig.onEdit(item)
          } else {
            const path = `${actionConfig.basePath}.edit`
            console.log('Navigating to:', path, item.id)
            router.get(route(path, item.id))
          }
        }

        // Handler untuk delete
        const handleDelete = () => {
          if (actionConfig.onDelete) {
            actionConfig.onDelete(item)
          } else {
            setDeleting(true)
            router.delete(route(actionConfig.basePath + '.destroy', item.id), {
              onSuccess: () => {
                router.reload()
              },
              onError: (error) => {
                console.error('Gagal menghapus item:', error)
                alert('Terjadi kesalahan saat menghapus item. Silakan coba lagi.')
              },
              onFinish: () => {
                setDeleting(false)
                setShowDeleteDialog(false)
                router.visit(route(actionConfig.basePath + '.index'))
              }
            })
          }
        }

        const handleDeleteClick = (e: React.MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          handleDelete()
        }

        const handleSwitchChange = (checked: boolean) => {
          const switchKey = actionConfig.switchKey || 'status';
          let newValue;

          if (actionConfig.switchTrueValue !== undefined && actionConfig.switchFalseValue !== undefined) {
            newValue = checked ? actionConfig.switchTrueValue : actionConfig.switchFalseValue;
          } else if (actionConfig.getNextSwitchValue) {
            newValue = actionConfig.getNextSwitchValue(item[switchKey]);
          } else {
            newValue = checked;
          }

          if (actionConfig.isValueSwitchable && !actionConfig.isValueSwitchable(item[switchKey])) {
            return;
          }

          if (actionConfig.onSwitch) {
            actionConfig.onSwitch(item, newValue);
          } else {
            router.put(route(actionConfig.basePath + '.updateStatus', item.id), {
              [switchKey]: newValue
            }, {
              preserveState: true,
              preserveScroll: true,
              onError: (errors) => {
                console.error('Switch update failed:', errors);
              }
            });
          }
        }

        const handleAction = () => {
          // First, check if there's a custom action handler
          if (actionConfig.onAction) {
            actionConfig.onAction(item);
            return; // Exit early if custom handler is used
          }

          // Validate that all required configuration properties exist
          if (!actionConfig.actionButtonPath ||
            !actionConfig.actionButtonKey ||
            !actionConfig.actionButtonValues ||
            !Array.isArray(actionConfig.actionButtonValues)) {
            console.error('Missing or invalid action configuration');
            return;
          }

          // Get the current status value from the item
          const currentValue = item[actionConfig.actionButtonKey];

          // Check if the current value exists in our allowed values array
          if (!actionConfig.actionButtonValues.includes(currentValue)) {
            console.error(`Current value "${currentValue}" not found in allowed values`);
            return;
          }

          // Find the current value's position in the array
          const currentIndex = actionConfig.actionButtonValues.indexOf(currentValue);

          let nextIndex = (currentIndex + 1);
          if (nextIndex >= actionConfig.actionButtonValues.length) {
            console.error(`No next value found for "${currentValue}"`);
            nextIndex -= 1;
            return;
          }
          const nextValue = actionConfig.actionButtonValues[nextIndex];

          console.log(`Changing status from "${currentValue}" to "${nextValue}"`);

          // Make the API call to update the status
          router.put(route(actionConfig.basePath + actionConfig.actionButtonPath, item.id), {
            [actionConfig.actionButtonKey]: nextValue
          }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
              console.log('Status updated successfully');
              router.reload();
            },
            onError: (error) => {
              console.error('Failed to update status:', error);
              alert('Terjadi kesalahan saat mengubah status. Silakan coba lagi.');
            }
          }
          );
        };

        const handleEachAction = ({ key, value, label, path }: { key: string, label: string, value: any, path: string }) => {
          setProcessing(true);
          console.log(`Handling action for key: ${key}, value: ${value}, label: ${label}, path: ${actionConfig.basePath + path}`);
          const data = { [key]: value };
          router.put(route(actionConfig.basePath + path, item.id), data, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
              console.log(`Action "${label}" executed successfully`);
              router.reload();
            },
            onError: (error) => {
              console.error(`Failed to execute action "${label}":`, error);
            },
            onFinish: () => {
              setProcessing(false);
              router.visit(route(actionConfig.basePath + '.index'));
            }
          })
        }

        return (
          <>
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <EllipsisVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {actionConfig.showActionButton !== false && (
                    <DropdownMenuItem
                      onClick={handleAction}
                      variant="default"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      {actionConfig.actionButtonLabel || 'Aksi'}
                    </DropdownMenuItem>
                  )}
                  {(actionConfig.showActionButton && (actionConfig.showMultipleButtons || actionConfig.showSwitch || actionConfig.showEdit || actionConfig.showDelete)) && <DropdownMenuSeparator />}
                  <div className="flex flex-col items-start">
                    {actionConfig.showMultipleButtons && actionConfig.multipleButtonKeys && actionConfig.multipleButtonKeys.length > 0 && (
                      actionConfig.multipleButtonKeys.map((key, index) => {
                        const label = Array.isArray(actionConfig.multipleButtonLabels) ? actionConfig.multipleButtonLabels[index] : actionConfig.multipleButtonLabels;
                        const value = Array.isArray(actionConfig.multipleButtonValues) ? actionConfig.multipleButtonValues[index] : actionConfig.multipleButtonValues;
                        const path = Array.isArray(actionConfig.multipleButtonPaths) ? actionConfig.multipleButtonPaths[index] : actionConfig.multipleButtonPaths;
                        const variant = Array.isArray(actionConfig.multipleButtonVariants) ? actionConfig.multipleButtonVariants[index] : actionConfig.multipleButtonVariants;

                        // Skip if required values are undefined
                        if (!label || !path) {
                          return null;
                        }

                        return (
                          <form onSubmit={() => handleEachAction({ key, label, value, path })} className="w-full">
                            <input type="hidden" name={key} value={value} />
                            <button type="submit" className="w-full" disabled={processing}>
                              <DropdownMenuItem
                                key={key}
                                disabled={processing}
                                variant={`${variant as 'default' || 'destructive'}`}
                                className="w-full"
                              >
                                <SendHorizonal className="h-4 w-4 mr-1" />
                                {label || "Aksi"}
                              </DropdownMenuItem>
                            </button>
                          </form>
                        )
                      }).filter(Boolean)
                    )}
                  </div>
                  {(actionConfig.showMultipleButtons && (actionConfig.showSwitch || actionConfig.showEdit || actionConfig.showDelete)) && <DropdownMenuSeparator />}
                  {actionConfig.showSwitch !== false && (
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Switch
                        className="mr-1"
                        checked={
                          actionConfig.getSwitchChecked
                            ? actionConfig.getSwitchChecked(item)
                            : !!item[actionConfig.switchKey || 'status']
                        }
                        onCheckedChange={handleSwitchChange}
                      />
                      {actionConfig.switchLabel || 'Status'}
                    </DropdownMenuItem>
                  )}
                  {(actionConfig.showSwitch && (actionConfig.showEdit || actionConfig.showDelete)) && <DropdownMenuSeparator />}
                  {actionConfig.showEdit !== false && (
                    <DropdownMenuItem onClick={handleEdit}>
                      <Pencil className="h-4 w-4 mr-1" />
                      {actionConfig.editLabel || 'Edit'}
                    </DropdownMenuItem>
                  )}
                  {actionConfig.showDelete !== false && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setShowDeleteDialog(true)
                      }}
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {actionConfig.deleteLabel || 'Hapus'}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* AlertDialog For Deleting */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Apakah Anda yakin ingin menghapus item ini?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Aksi ini tidak dapat dibatalkan. Item ini akan dihapus secara permanen
                    dan tidak dapat dipulihkan lagi.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleting} onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDeleting(false);
                    setShowDeleteDialog(false);
                    router.visit(route(actionConfig.basePath + '.index'));
                  }}>
                    Batal
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteClick}
                    disabled={deleting}
                    className={cn(buttonVariants({ variant: 'destructive' }))}
                  >
                    {deleting ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      "Hapus"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )
      },
    })
  }

  return columns
}