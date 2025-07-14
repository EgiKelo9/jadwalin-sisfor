"use client"

import { ColumnDef } from "@tanstack/react-table"
import { createTableColumns, BaseEntity } from "@/components/ui/columns"

export type AksesRole = {
    id: number
    nama: string
    jumlah: number
    akses: string | string[]
} & BaseEntity

export function createAksesRoleColumns(userRole?: string, canUpdate?: boolean): ColumnDef<AksesRole>[] {
    return createTableColumns<AksesRole>({
        dataColumns: [
            {
                key: "nama",
                header: "Nama Pengguna",
                sortable: true,
                type: "text",
            },
            {
                key: "jumlah",
                header: "Jumlah Akses",
                sortable: true,
                type: "text",
                suffix: " Akses",
            },
            {
                key: "akses",
                header: "Akses Dimiliki",
                sortable: false,
                type: "custom",
                customRenderer: (row) => {
                    return (
                        <span>
                            {Array.isArray(row.akses) ? row.akses.join(', ') : row.akses}
                        </span>
                    )
                }
            },
        ],
        actionConfig: {
            basePath: userRole + ".peran-dan-akses",
            showEdit: canUpdate ?? false,
            showDelete: false,
            showSwitch: false,
            showActionButton: false,
            showMultipleButtons: false,
        },
        showSelectColumn: false,
    });
}

// Keep the original export for backward compatibility
export const AksesRoleColumns: ColumnDef<AksesRole>[] = createAksesRoleColumns();