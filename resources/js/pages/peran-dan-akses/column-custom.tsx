"use client"

import { ColumnDef } from "@tanstack/react-table"
import { createTableColumns, BaseEntity } from "@/components/ui/columns"

export type AksesRole = {
    id: number
    nama: string
    mahasiswa: string | number
    dosen: string | number
    admin: string | number
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
                key: "mahasiswa",
                header: "Akses Mahasiswa",
                sortable: true,
                type: "text",
                suffix: " Akses",
            },
            {
                key: "dosen",
                header: "Akses Dosen",
                sortable: true,
                type: "text",
                suffix: " Akses",
            },
            {
                key: "admin",
                header: "Akses Admin",
                sortable: true,
                type: "text",
                suffix: " Akses",
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