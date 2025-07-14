import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { createMataKuliahColumns } from './column';
import { DataTable, ColumnFilterConfig } from '@/components/ui/data-table';
import { exportGenericDataToPDF } from '@/utils/pdf-export';
import { ColumnFiltersState } from "@tanstack/react-table";

export const columnFiltersConfig: ColumnFilterConfig[] = [
    {
        columnId: 'bobot_sks',
        label: 'SKS',
        type: 'select',
    },
    {
        columnId: 'semester',
        label: 'Semester',
        type: 'select',
    },
    {
        columnId: 'status',
        label: 'Status',
        type: 'select',
        options: ['aktif', 'nonaktif'],
    },
];

interface MataKuliahTableProps {
    mataKuliahs: any[];
    userRole: string;
    canCreate?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
    tabAktif?: string;
    isMahasiswa?: boolean;
}

export default function MataKuliah({ mataKuliahs, userRole, canCreate, canUpdate, canDelete, tabAktif, isMahasiswa }: MataKuliahTableProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: userRole.charAt(0).toUpperCase() + userRole.slice(1),
            href: `/${userRole}/beranda`,
        },
        {
            title: 'Mata Kuliah',
            href: `/${userRole}/mata-kuliah`,
        },
    ];

    // Create columns with permissions
    const columns = createMataKuliahColumns(userRole, canUpdate, canDelete, tabAktif);

    const mahasiswaPdfExportHandler = (
        data: any[],
        columnFilters?: ColumnFiltersState,
        globalFilter?: string
        ) => {
        const numberedData = data.map((item, idx) => ({ no: idx + 1, nama_dosen: item.dosen?.nama ,...item }));

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
            title: "Daftar Mata Kuliah",
            fileName: `Daftar Mata Kuliah-${new Date().toISOString().split("T")[0]}.pdf`,
            data: numberedData,
            columns: [
            { header: "No", dataKey: "no", width: 15 },
            { header: "Kode", dataKey: "kode", width: 25 },
            { header: "Nama Mata Kuliah", dataKey: "nama", width: 45 },
            { header: "SKS", dataKey: "bobot_sks", width: 15 },
            { header: "Semester", dataKey: "semester", width: 25 },
            { header: "Dosen", dataKey: "nama_dosen", width: 35 },
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
            <Head title="Mata Kuliah" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable
                    title="Mata Kuliah"
                    href={`/${userRole}/mata-kuliah`}
                    columns={columns}
                    data={mataKuliahs}
                    showSearch={true}
                    showCreateButton={canCreate}
                    showColumnFilter={true}
                    showDataFilter={true}
                    showPdfExport={true}
                    pdfExportHandler={mahasiswaPdfExportHandler}
                    columnFilters={columnFiltersConfig}
                    showActiveTab={isMahasiswa ?? false}
                    activeTab={['Semua', 'Favorit']}
                    defaultTab="Semua"
                />
            </div>
        </AppLayout>
    );
}
