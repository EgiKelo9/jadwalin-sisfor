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

export const RuangKelasColumns: ColumnDef<RuangKelas>[] = createTableColumns<RuangKelas>({
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
        basePath: "admin.ruang-kelas",
        showEdit: true,
        showDelete: true,
        showSwitch: false,
        showActionButton: false,
    },
    showSelectColumn: true,
})