import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { createPeminjamanKelasColumns } from './column-index';
import { DataTable, ColumnFilterConfig } from '@/components/ui/data-table';
import { exportGenericDataToPDF } from '@/utils/pdf-export';
import { ColumnFiltersState } from "@tanstack/react-table";

export const columnFiltersConfig: ColumnFilterConfig[] = [
    {
        columnId: 'tanggal_peminjaman',
        label: 'Tanggal',
        type: 'date',
    },
];

interface PeminjamanKelasTableProps {
    peminjamanKelas: any[];
    userRole: string;
    canCreate?: boolean;
    canConfirm?: boolean;
    canViewHistory?: boolean;
}

export default function PeminjamanKelas({ peminjamanKelas, userRole, canCreate, canConfirm, canViewHistory }: PeminjamanKelasTableProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: userRole.charAt(0).toUpperCase() + userRole.slice(1),
            href: `/${userRole}/beranda`,
        },
        {
            title: 'Peminjaman Kelas',
            href: `/${userRole}/peminjaman-kelas`,
        },
    ];

    // Create columns with permissions
    const columns = createPeminjamanKelasColumns(userRole, canConfirm);
    
    const peminjamanKelasPdfExportHandler = (
        data: any[],
        columnFilters?: ColumnFiltersState,
        globalFilter?: string
        ) => {
        const numberedData = data.map((item, idx) => ({ 
            no: idx + 1,
            nama_ruangan: item.ruang_kelas?.nama ?? "-",
            nama_gedung: item.ruang_kelas?.gedung ?? "-",
            nama_peminjam: item.mahasiswa?.nama || item.dosen?.nama || item.admin?.nama || '-',
            tanggal_peminjaman: item.tanggal_peminjaman,
            jam_mulai: item.jam_mulai,
            jam_selesai: item.jam_selesai,
            pending: item.status,
        }));

        // Rakit keterangan filter aktif
        let filterDescription = '';
        if (globalFilter) {
            filterDescription += `Pencarian: "${globalFilter}"`;
        }
        if (columnFilters && columnFilters.length > 0) {
            const filterTexts = columnFilters.map(f => `${f.id}: ${String(f.value)}`);
            filterDescription += (filterDescription ? " | " : "") + filterTexts.join(", ");
        }

        exportGenericDataToPDF({
            title: "Daftar Peminjaman Kelas",
            fileName: `Daftar Peminjan Kelas-${new Date().toISOString().split("T")[0]}.pdf`,
            data: numberedData,
            columns: [
                { header: "No", dataKey: "no", width: 15 },
                { header: "Nama Ruangan", dataKey: "nama_ruangan", width: 25 },
                { header: "Nama Gedung", dataKey: "nama_gedung", width: 20 },
                { header: "Nama Peminjam", dataKey: "nama_peminjam", width: 30 },
                { header: "Tanggal Peminjaman", dataKey: "tanggal_peminjaman", width: 30 },
                { header: "Jam Mulai", dataKey: "jam_mulai", width: 20 },
                { header: "Jam Selesai", dataKey: "jam_selesai", width: 20 },
                { header: "Status", dataKey: "pending", width: 20 },
            ],
            orientation: "portrait",
            headerInfo: {
            printDate: undefined,
            filterDescription, // kita simpan keterangan filter di sini
            },
            // headerImage: logoHeader,
            // footerImage: logoFooter,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole={userRole}>
            <Head title="Peminjaman Kelas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable
                    title="Peminjaman Kelas"
                    href={`/${userRole}/peminjaman-kelas`}
                    columns={columns}
                    data={peminjamanKelas}
                    showSearch={true}
                    showCreateButton={canCreate}
                    showColumnFilter={true}
                    showDataFilter={true}
                    showPdfExport={true}
                    pdfExportHandler={peminjamanKelasPdfExportHandler}
                    showHistoryButton={canViewHistory}
                    columnFilters={columnFiltersConfig}
                />
            </div>
        </AppLayout>
    );
}
