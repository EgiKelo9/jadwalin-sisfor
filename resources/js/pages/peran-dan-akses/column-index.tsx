"use client"

import { ColumnDef } from "@tanstack/react-table"
import { createTableColumns, BaseEntity } from "@/components/ui/columns"

export type AksesRole = {
    id: number
    akses: string
    deskripsi: string
} & BaseEntity

export function createAksesRoleColumns(userRole?: string, canUpdate?: boolean): ColumnDef<AksesRole>[] {
    return createTableColumns<AksesRole>({
        dataColumns: [
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
        showSelectColumn: false,
    });
}

// Keep the original export for backward compatibility
export const AksesRoleColumns: ColumnDef<AksesRole>[] = createAksesRoleColumns();