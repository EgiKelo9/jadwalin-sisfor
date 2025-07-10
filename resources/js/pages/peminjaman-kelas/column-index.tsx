"use client"

import { ColumnDef } from "@tanstack/react-table"
import { createTableColumns, BaseEntity } from "@/components/ui/columns"

export type PeminjamanKelas = {
    id: number
    tanggal_peminjaman: Date
    jam_mulai: Date
    jam_selesai: Date
    alasan: string
    status: "pending" | "diterima" | "ditolak"
    ruang_kelas_id: number
    mahasiswa: {
        id: number
        nama: string
    }
    dosen: {
        id: number
        nama: string
    }
    admin: {
        id: number
        nama: string
    }
    ruang_kelas: {
        id: number
        nama: string
        gedung: string
    }
} & BaseEntity

export function createPeminjamanKelasColumns(userRole?: string, canConfirm?: boolean): ColumnDef<PeminjamanKelas>[] {
    return createTableColumns<PeminjamanKelas>({
        dataColumns: [
            {
                key: "ruang_kelas.nama",
                header: "Nama Ruang",
                sortable: true,
                type: "text",
            },
            {
                key: "ruang_kelas.gedung",
                header: "Nama Gedung",
                sortable: true,
                type: "text",
            },
            {
                key: "nama_peminjam",
                header: "Nama Peminjam",
                sortable: false,
                type: "custom",
                customRenderer: (item: PeminjamanKelas) => {
                    const nama = item.mahasiswa?.nama || item.dosen?.nama || item.admin?.nama || 'N/A';
                    return <span className="truncate max-w-96">{nama}</span>;
                },
            },
            {
                key: "tanggal_peminjaman",
                header: "Tanggal",
                sortable: true,
                type: "date",
            },
            {
                key: "jam_mulai",
                header: "Mulai",
                sortable: false,
                type: "time",
            },
            {
                key: "jam_selesai",
                header: "Selesai",
                sortable: false,
                type: "time",
            },
        ],
        actionConfig: {
            basePath: userRole + ".peminjaman-kelas",
            showEdit: false,
            showDelete: false,
            showSwitch: false,
            showActionButton: false,
            showMultipleButtons: canConfirm ?? false,
            multipleButtonKeys: ["status", "status"],
            multipleButtonLabels: ["Terima", "Tolak"],
            multipleButtonValues: ["diterima", "ditolak"],
            multipleButtonVariants: ["default", "destructive"],
            multipleButtonPaths: ['.updateStatus', '.updateStatus'],
        },
        showSelectColumn: false,
    });
}

// Keep the original export for backward compatibility
export const PeminjamanKelasColumns: ColumnDef<PeminjamanKelas>[] = createPeminjamanKelasColumns();