"use client"

import { ColumnDef } from "@tanstack/react-table"
import { createTableColumns, BaseEntity } from "@/components/ui/columns"

export type Dosen = {
    id: number
    nip: string
    nidn: string
    nama: string
    email: string
    telepon: string
    alamat: string
    foto: File | string
    status: "aktif" | "nonaktif"
} & BaseEntity

export function createDosenColumns(userRole?: string, canUpdate?: boolean, canDelete?: boolean): ColumnDef<Dosen>[] {
    return createTableColumns<Dosen>({
        dataColumns: [
            {
                key: "foto",
                header: "Foto",
                sortable: false,
                type: "image",
            },
            {
                key: "nip",
                header: "NIP",
                sortable: true,
                type: "text",
            },
            {
                key: "nidn",
                header: "NIDN",
                sortable: true,
                type: "text",
            },
            {
                key: "nama",
                header: "Nama Lengkap",
                sortable: true,
                type: "text",
            },
            {
                key: "telepon",
                header: "Telepon",
                sortable: false,
                type: "text",
            },
            {
                key: "email",
                header: "Email",
                sortable: false,
                type: "text",
            },
            {
                key: "status",
                header: "Status",
                sortable: true,
                type: "badge",
            },
        ],
        actionConfig: {
            basePath: userRole + ".data-dosen",
            showEdit: canUpdate ?? false,
            showDelete: canDelete ?? false,
            showSwitch: canUpdate ?? false,
            showActionButton: false,
            showMultipleButtons: false,
            switchLabel: "Status",
            switchKey: "status",
            getSwitchChecked: (item) => item.status === 'aktif',
            switchTrueValue: 'aktif',
            switchFalseValue: 'nonaktif',
        },
        showSelectColumn: false,
    })
}

// Keep the original export for backward compatibility
export const DosenColumns: ColumnDef<Dosen>[] = createDosenColumns();