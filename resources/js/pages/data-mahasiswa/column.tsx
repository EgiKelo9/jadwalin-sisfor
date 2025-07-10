"use client"

import { ColumnDef } from "@tanstack/react-table"
import { createTableColumns, BaseEntity } from "@/components/ui/columns"

export type Mahasiswa = {
    id: number
    nim: string
    nama: string
    email: string
    telepon: string
    alamat: string
    foto: File | string
    status: "aktif" | "nonaktif"
} & BaseEntity 

export function createMahasiswaColumns(userRole?: string, canUpdate?: boolean, canDelete?: boolean): ColumnDef<Mahasiswa>[] {
    return createTableColumns<Mahasiswa>({
        dataColumns: [
            {
                key: "foto",
                header: "Foto",
                sortable: false,
                type: "image",
            },
            {
                key: "nim",
                header: "NIM",
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
                key: "alamat",
                header: "Alamat",
                sortable: false,
                type: "text",
            },
            {
                key: "telepon",
                header: "Telepon",
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
            basePath: userRole + ".data-mahasiswa",
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
    });
}

// Keep the original export for backward compatibility
export const MahasiswaColumns: ColumnDef<Mahasiswa>[] = createMahasiswaColumns();