import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { createJadwalSementaraColumns } from './column';
import { DataTable, ColumnFilterConfig } from '@/components/ui/data-table';
import { exportGenericDataToPDF } from '@/utils/pdf-export';
import { ColumnFiltersState } from "@tanstack/react-table";

interface DaftarJadwalTableProps {
    jadwals: any[];
    userRole: string;
    canCreate?: boolean;
    canUpdate?: boolean;
    canShowAjukan?: boolean;
}

export default function Jadwal({ jadwals, userRole, canCreate, canUpdate, canShowAjukan }: DaftarJadwalTableProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: userRole.charAt(0).toUpperCase() + userRole.slice(1),
            href: `/${userRole}/beranda`,
        },
        {
            title: 'Jadwal Perkuliahan',
            href: `/${userRole}/jadwal-perkuliahan`,
        },
    ];

    // Create columns with permissions
    const columns = createJadwalSementaraColumns(userRole, canUpdate);

    // console.log(data);

    const jadwalPerkuliahanPdfExportHandler = (
        data: any[],
        columnFilters?: ColumnFiltersState,
        globalFilter?: string
        ) => {
        const numberedData = data.map((item, idx) => ({ 
            no: idx + 1,
            mata_kuliah_nama: item.jadwal?.mata_kuliah?.nama ?? "-",
            ruang_kelas_nama: item.ruang_kelas
            ? `${item.ruang_kelas.nama} (${item.ruang_kelas.gedung}, Lantai ${item.ruang_kelas.lantai})`
            : "-",
            tanggal: item.tanggal,
            jam_mulai: item.jam_mulai,
            jam_selesai: item.jam_selesai, 
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
            title: "Jadwal Perkkuliahan",
            fileName: `Jadwal Perkuliahan-${new Date().toISOString().split("T")[0]}.pdf`,
            data: numberedData,
            columns: [
                { header: "No", dataKey: "no", width: 15 },
                { header: "Nama Mata Kuliah", dataKey: "mata_kuliah_nama", width: 25 },
                { header: "Ruang Kelas", dataKey: "ruang_kelas_nama", width: 45 },
                { header: "Tanggal", dataKey: "tanggal", width: 50 },
                { header: "Mulai", dataKey: "jam_mulai", width: 30 },
                { header: "Selesai", dataKey: "jam_selesai", width: 20 },
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
            <Head title="Jadwal Perkuliahan" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable
                    title="Jadwal Perkuliahan"
                    href={`/${userRole}/jadwal-perkuliahan`}
                    columns={columns}
                    data={jadwals}
                    showSearch={true}
                    showCreateButton={canCreate}
                    showColumnFilter={false}
                    showDataFilter={true}
                    showPdfExport={true}
                    pdfExportHandler={jadwalPerkuliahanPdfExportHandler}
                    showTopActionButton={canShowAjukan}
                    topActionButtonLabel="Ajukan"
                    topActionButtonHref="ajukan-perubahan-jadwal"
                />
            </div>
        </AppLayout>
    );
}
