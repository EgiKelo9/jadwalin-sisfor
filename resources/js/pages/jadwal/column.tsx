"use client"

import { ColumnDef } from "@tanstack/react-table"
import { createTableColumns, BaseEntity } from "@/components/ui/columns"

export type JadwalSementara = {
    jadwal: {
        id: number
        mata_kuliah_id: number
        ruang_kelas_id: number
        hari: "senin" | "selasa" | "rabu" | "kamis" | "jumat"
        jam_mulai: string
        jam_selesai: string
        mata_kuliah: {
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
        }
    }
    id: number
    mata_kuliah_id: number
    ruang_kelas_id: number
    tanggal: string | Date
    jam_mulai: string
    jam_selesai: string
    ruang_kelas: {
        id: number
        nama: string
        gedung: string
        lantai: number
        kapasitas: number
        status: "layak" | "tidak_layak" | "perbaikan"
    }
    status: "aktif" | "nonaktif"
} & BaseEntity

export function createJadwalSementaraColumns(userRole?: string, canUpdate?: boolean, canDelete?: boolean): ColumnDef<JadwalSementara>[] {
    return createTableColumns<JadwalSementara>({
        dataColumns: [
            {
                key: "jadwal.mata_kuliah.nama",
                header: "Nama Mata Kuliah",
                sortable: false,
                type: "text",
            },
            {
                key: "ruang_kelas.nama",
                header: "Ruang Kelas",
                sortable: true,
                type: "custom",
                customRenderer: (item) => {
                    if (item.ruang_kelas === null) {
                        return "Online Meeting";
                    }
                    return `${item.ruang_kelas?.nama} (${item.ruang_kelas?.gedung}, Lantai ${item.ruang_kelas?.lantai})`;
                }
            },
            {
                key: "tanggal",
                header: "Tanggal",
                sortable: true,
                type: "custom",
                customRenderer: (item) => {
                    return new Date(item.tanggal).toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    });
                }
            },
            {
                key: "jam_mulai",
                header: "Mulai",
                sortable: false,
                type: "text",
            },
            {
                key: "jam_selesai",
                header: "Selesai",
                sortable: false,
                type: "text",
            },
        ],
        actionConfig: {
            basePath: userRole + ".jadwal-perkuliahan",
            showEdit: canUpdate ?? false,
            showDelete: canDelete ?? false,
            showSwitch: false,
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
export const JadwalColumns: ColumnDef<JadwalSementara>[] = createJadwalSementaraColumns();