import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { createRuangKelasColumns } from './column';
import { DataTable, ColumnFilterConfig } from '@/components/ui/data-table';
import { exportGenericDataToPDF } from '@/utils/pdf-export';
import { ColumnFiltersState } from "@tanstack/react-table";

export const columnFiltersConfig: ColumnFilterConfig[] = [
    {
        columnId: 'gedung',
        label: 'Gedung',
        type: 'select',
    },
    {
        columnId: 'kapasitas',
        label: 'Kapasitas',
        type: 'select',
    },
    {
        columnId: 'status',
        label: 'Status',
        type: 'select',
        options: ['layak', 'tidak_layak', 'perbaikan'],
    },
];

interface RuangKelasTableProps {
    ruangKelas: any[];
    userRole: string;
    canCreate?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
}

export default function RuangKelas({ ruangKelas, userRole, canCreate, canUpdate, canDelete }: RuangKelasTableProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: userRole.charAt(0).toUpperCase() + userRole.slice(1),
            href: `/${userRole}/beranda`,
        },
        {
            title: 'Ruang Kelas',
            href: `/${userRole}/ruang-kelas`,
        },
    ];

    // Create columns with permissions
    const columns = createRuangKelasColumns(userRole, canUpdate, canDelete);

    const ruangKelasPdfExportHandler = (
        data: any[],
        columnFilters?: ColumnFiltersState,
        globalFilter?: string
        ) => {
        const numberedData = data.map((item, idx) => ({ no: idx + 1, ...item }));

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
            title: "Daftar Ruang Kelas",
            fileName: `Daftar Ruang Kelas-${new Date().toISOString().split("T")[0]}.pdf`,
            data: numberedData,
            columns: [
                { header: "No", dataKey: "no", width: 15 },
                { header: "Nama", dataKey: "nama", width: 45 },
                { header: "Gedung", dataKey: "gedung", width: 45 },
                { header: "Lantai", dataKey: "lantai", width: 25 },
                { header: "Kapasitas", dataKey: "kapasitas", width: 25 },
                { header: "Status", dataKey: "status", width: 25 },
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
            <Head title="Ruang Kelas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable
                    title="Ruang Kelas"
                    href={`/${userRole}/ruang-kelas`}
                    columns={columns}
                    data={ruangKelas}
                    showSearch={true}
                    showCreateButton={canCreate}
                    showColumnFilter={true}
                    showDataFilter={true}
                    showPdfExport={true}
                    pdfExportHandler={ruangKelasPdfExportHandler}
                    columnFilters={columnFiltersConfig}
                />
            </div>
        </AppLayout>
    );
}
