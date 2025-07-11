"use client"

import { ColumnDef } from "@tanstack/react-table"
import { createTableColumns, BaseEntity } from "@/components/ui/columns"
import React, { useEffect, useState } from 'react';

export type PerubahanJadwal = {
    id: number
    jadwal_sementara_id: number
    ruang_kelas_id: number
    tanggal_perubahan: string | Date
    jam_mulai_baru: string
    jam_selesai_baru: string
    alasan_perubahan: string
    jadwal_sementara: {
        id: number
        jadwal_id: number
        ruang_kelas_id: number
        hari_perubahan: "senin" | "selasa" | "rabu" | "kamis" | "jumat"
        jam_mulai_baru: string
        jam_selesai_baru: string
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
            ruang_kelas: {
                id: number
                nama: string
                gedung: string
                lantai: number
                kapasitas: number
                status: "layak" | "tidak_layak" | "perbaikan"
            }
        }
        ruang_kelas: {
            id: number
            nama: string
            gedung: string
            lantai: number
            kapasitas: number
            status: "layak" | "tidak_layak" | "perbaikan"
        }
        status: "aktif" | "nonaktif"
    }
    ruang_kelas: {
        id: number
        nama: string
        gedung: string
        lantai: number
        kapasitas: number
        status: "layak" | "tidak_layak" | "perbaikan"
    }
} & BaseEntity

export function createPerubahanJadwalColumns(userRole?: string, canUpdate?: boolean, canDelete?: boolean): ColumnDef<PerubahanJadwal>[] {
    // Check URL parameter inside the function
    const params = new URLSearchParams(window.location.search);
    const tabAktif = params.get('tabAktif');

    // Set showMultipleButtons to false if tabAktif is 'Dikonfirmasi'
    const shouldShowButtons = tabAktif === 'Dikonfirmasi' ? false : (canUpdate ?? false);
    const shouldShowEdit = tabAktif !== 'Menunggu' && (canUpdate ?? false);
    const shouldShowDelete = tabAktif !== 'Menunggu' && (canDelete ?? false);
    return createTableColumns<PerubahanJadwal>({
        dataColumns: [
            {
                key: "jadwal_sementara_id",
                header: "ID Jadwal",
                sortable: true,
                type: "text",
            },
            {
                key: "jadwal_sementara.jadwal.mata_kuliah.nama",
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
                    return `${item.ruang_kelas.nama} (${item.ruang_kelas.gedung}, Lantai ${item.ruang_kelas.lantai})`;
                }
            },
            {
                key: "tanggal_perubahan",
                header: "Tanggal (Baru)",
                sortable: true,
                type: "date",
            },
            {
                key: "jam_mulai_baru",
                header: "Mulai",
                sortable: false,
                type: "text",
            },
            {
                key: "jam_selesai_baru",
                header: "Selesai",
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
            basePath: userRole + ".ajukan-perubahan-jadwal",
            showEdit: shouldShowEdit,
            showDelete: shouldShowDelete,
            showSwitch: false,
            showActionButton: false,
            showMultipleButtons: shouldShowButtons,
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
export const PerubahanJadwalColumns: ColumnDef<PerubahanJadwal>[] = createPerubahanJadwalColumns();