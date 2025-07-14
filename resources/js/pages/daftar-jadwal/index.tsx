import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { createDaftarJadwalColumns } from './column';
import { DataTable, ColumnFilterConfig } from '@/components/ui/data-table';
import { exportGenericDataToPDF } from '@/utils/pdf-export';
import { ColumnFiltersState } from "@tanstack/react-table";

export const columnFiltersConfig: ColumnFilterConfig[] = [
    {
        columnId: 'hari',
        label: 'Hari',
        type: 'select',
        options: ['senin', 'selasa', 'rabu', 'kamis', 'jumat'],
    },
    {
        columnId: 'status',
        label: 'Status',
        type: 'select',
        options: ['aktif', 'nonaktif'],
    },
];

interface DaftarJadwalTableProps {
    daftarJadwals: any[];
    userRole: string;
    canCreate?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
    canShowAjukan?: boolean;
}

export default function DaftarJadwal({ daftarJadwals, userRole, canCreate, canUpdate, canDelete, canShowAjukan }: DaftarJadwalTableProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: userRole.charAt(0).toUpperCase() + userRole.slice(1),
            href: `/${userRole}/beranda`,
        },
        {
            title: 'Daftar Jadwal',
            href: `/${userRole}/daftar-jadwal`,
        },
    ];

    // Create columns with permissions
    const columns = createDaftarJadwalColumns(userRole, canUpdate, canDelete);
    
    const daftarJadwalPdfExportHandler = (
        data: any[],
        columnFilters?: ColumnFiltersState,
        globalFilter?: string
        ) => {
        const numberedData = data.map((item, idx) => ({ 
            no: idx + 1,
            mata_kuliah_nama: item.mata_kuliah?.nama ?? "-",
            ruang_kelas_nama: item.ruang_kelas
            ? `${item.ruang_kelas.nama} (${item.ruang_kelas.gedung}, Lantai ${item.ruang_kelas.lantai})`
            : "-",
            hari: item.hari.charAt(0).toUpperCase() + item.hari.slice(1),
            jam_mulai: item.jam_mulai,
            jam_selesai: item.jam_selesai,
            status: item.status, 
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
            title: "Daftar Jadwal",
            fileName: `Daftar Jadwal-${new Date().toISOString().split("T")[0]}.pdf`,
            data: numberedData,
            columns: [
                { header: "No", dataKey: "no", width: 15 },
                { header: "Nama Mata Kuliah", dataKey: "mata_kuliah_nama", width: 45 },
                { header: "Ruang Kelas", dataKey: "ruang_kelas_nama", width: 45 },
                { header: "Hari", dataKey: "hari", width: 20 },
                { header: "Mulai", dataKey: "jam_mulai", width: 20 },
                { header: "Selesai", dataKey: "jam_selesai", width: 20 },
                { header: "Status", dataKey: "status", width: 20 },
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
            <Head title="Daftar Jadwal" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable
                    title="Daftar Jadwal"
                    href={`/${userRole}/daftar-jadwal`}
                    columns={columns}
                    data={daftarJadwals}
                    showSearch={true}
                    showCreateButton={canCreate}
                    showColumnFilter={false}
                    showDataFilter={true}
                    showPdfExport={true}
                    pdfExportHandler={daftarJadwalPdfExportHandler}
                    columnFilters={columnFiltersConfig}
                    showTopActionButton={canShowAjukan}
                    topActionButtonLabel="Ajukan"
                    topActionButtonHref="ajukan-perubahan-daftar"
                />
            </div>
        </AppLayout>
    );
}
