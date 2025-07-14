import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { createMahasiswaColumns } from './column';
import { DataTable, ColumnFilterConfig } from '@/components/ui/data-table';
import { exportGenericDataToPDF } from '@/utils/pdf-export';
import { ColumnFiltersState } from "@tanstack/react-table";

export const columnFiltersConfig: ColumnFilterConfig[] = [
    {
        columnId: 'status',
        label: 'Status',
        type: 'select',
        options: ['aktif', 'nonaktif'],
    },
];

interface MahasiswaTableProps {
    mahasiswas: any[];
    userRole: string;
    canCreate?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
}

export default function Mahasiswa({ mahasiswas, userRole, canCreate, canUpdate, canDelete }: MahasiswaTableProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: userRole.charAt(0).toUpperCase() + userRole.slice(1),
            href: `/${userRole}/beranda`,
        },
        {
            title: 'Data Mahasiswa',
            href: `/${userRole}/data-mahasiswa`,
        },
    ];

    // Create columns with permissions
    const columns = createMahasiswaColumns(userRole, canUpdate, canDelete);

    const mahasiswaPdfExportHandler = (
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
            title: "Data Mahasiswa",
            fileName: `Data Mahasiswa-${new Date().toISOString().split("T")[0]}.pdf`,
            data: numberedData,
            columns: [
            { header: "No", dataKey: "no", width: 15 },
            { header: "NIM", dataKey: "nim", width: 25 },
            { header: "Nama Lengkap", dataKey: "nama", width: 45 },
            { header: "Alamat", dataKey: "alamat", width: 50 },
            { header: "Telepon", dataKey: "telepon", width: 30 },
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
            <Head title="Mahasiswa" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable
                    title="Mahasiswa"
                    href={`/${userRole}/data-mahasiswa`}
                    columns={columns}
                    data={mahasiswas}
                    showSearch={true}
                    showCreateButton={canCreate}
                    showColumnFilter={true}
                    showDataFilter={true}
                    showPdfExport={true}
                    pdfExportHandler={mahasiswaPdfExportHandler}
                    columnFilters={columnFiltersConfig}
                />
            </div>
        </AppLayout>
    );
}
