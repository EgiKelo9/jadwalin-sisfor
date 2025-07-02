"use client"

import { ColumnDef } from "@tanstack/react-table"
import { createTableColumns, BaseEntity } from "@/components/ui/columns"

export type MataKuliah = {
    id: number
    kode: string
    nama: string
    bobot_sks: number
    kapasitas: number
    semester: number
    status: "aktif" | "nonaktif"
    jenis: "wajib" | "pilihan"
    dosen: {
        id: number
        nama: string
    }
} & BaseEntity 

export const MataKuliahColumns: ColumnDef<MataKuliah>[] = createTableColumns<MataKuliah>({
    dataColumns: [
        {
            key: "kode",
            header: "Kode",
            sortable: true,
            type: "text",
        },
        {
            key: "nama",
            header: "Nama Mata Kuliah",
            sortable: true,
            type: "text",
        },
        {
            key: "bobot_sks",
            header: "SKS",
            sortable: true,
            type: "text",
        },
        {
            key: "semester",
            header: "Semester",
            sortable: true,
            type: "text",
        },
        {
            key: "dosen.nama",
            header: "Dosen Pengampu",
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
        basePath: "admin.mata-kuliah",
        showEdit: true,
        showDelete: true,
        showSwitch: true,
        showActionButton: false,
        getSwitchChecked: (item) => item.status === "aktif",
        switchLabel: "Status",
        switchKey: "status",
        switchTrueLabel: "aktif",
        switchFalseLabel: "nonaktif",
    },
    showSelectColumn: true,
})