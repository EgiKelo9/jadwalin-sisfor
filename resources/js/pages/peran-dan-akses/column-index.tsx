"use client"

import { ColumnDef } from "@tanstack/react-table"
import { createTableColumns, BaseEntity } from "@/components/ui/columns"

export type AksesRole = {
    id: number
    nama_role: string
    akses: string
    deskripsi: string
} & BaseEntity

export function createAksesRoleColumns(userRole?: string, canUpdate?: boolean): ColumnDef<AksesRole>[] {
    return createTableColumns<AksesRole>({
        dataColumns: [
            {
                key: "nama_role",
                header: "Peran",
                sortable: true,
                type: "text",
            },
            {
                key: "akses",
                header: "Nama Akses",
                sortable: true,
                type: "text",
            },
            {
                key: "deskripsi",
                header: "Deskripsi",
                sortable: false,
                type: "text",
            },
        ],
        actionConfig: {
            basePath: userRole + ".peran-dan-akses",
            showEdit: false,
            showDelete: false,
            showSwitch: false,
            showActionButton: false,
            showMultipleButtons: false,
        },
        showSelectColumn: true,
    });
}

// Keep the original export for backward compatibility
export const AksesRoleColumns: ColumnDef<AksesRole>[] = createAksesRoleColumns();