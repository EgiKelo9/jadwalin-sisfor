"use client"

import { ColumnDef } from "@tanstack/react-table"
import { createTableColumns, BaseEntity } from "@/components/ui/columns"

export type RuangKelas = {
    id: number
    nama: string
    gedung: string
    lantai: number
    kapasitas: number
    status: "layak" | "tidak_layak" | "perbaikan"
} & BaseEntity

export function createRuangKelasColumns(userRole?: string, canUpdate?: boolean, canDelete?: boolean): ColumnDef<RuangKelas>[] {
    return createTableColumns<RuangKelas>({
        dataColumns: [
            {
                key: "nama",
                header: "Nama",
                sortable: true,
                type: "text",
            },
            {
                key: "gedung",
                header: "Gedung",
                sortable: true,
                type: "text",
            },
            {
                key: "lantai",
                header: "Lantai",
                sortable: true,
                type: "text",
                prefix: "Lantai ",
            },
            {
                key: "kapasitas",
                header: "Kapasitas",
                sortable: true,
                type: "text",
                suffix: " orang",
            },
            {
                key: "status",
                header: "Status",
                sortable: true,
                type: "badge",
            },
        ],
        actionConfig: {
            basePath: userRole + ".ruang-kelas",
            showEdit: canUpdate ?? false,
            showDelete: canDelete ?? false,
            showSwitch: false,
            showActionButton: false,
            showMultipleButtons: false,
        },
        showSelectColumn: true,
    });
}

// Keep the original export for backward compatibility
export const RuangKelasColumns: ColumnDef<RuangKelas>[] = createRuangKelasColumns();