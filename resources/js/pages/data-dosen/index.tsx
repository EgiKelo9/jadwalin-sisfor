import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { createDosenColumns } from './column';
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

interface DosenTableProps {
    dosens: any[];
    userRole: string;
    canCreate?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
}

export default function Dosen({ dosens, userRole, canCreate, canUpdate, canDelete }: DosenTableProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: userRole.charAt(0).toUpperCase() + userRole.slice(1),
            href: `/${userRole}/beranda`,
        },
        {
            title: 'Data Dosen',
            href: `/${userRole}/data-dosen`,
        },
    ];

    // Create columns with permissions
    const columns = createDosenColumns(userRole, canUpdate, canDelete);

    const dosenPdfExportHandler = (
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
            title: "Data Dosen",
            fileName: `Data Dosen-${new Date().toISOString().split("T")[0]}.pdf`,
            data: numberedData,
            columns: [
            { header: "No", dataKey: "no", width: 15 },
            { header: "NIP", dataKey: "nip", width: 25 },
            { header: "NIDN", dataKey: "nidn", width: 25 },
            { header: "Nama Lengkap", dataKey: "nama", width: 45 },
            { header: "Telepon", dataKey: "telepon", width: 25 },
            { header: "Email", dataKey: "email", width: 25 },
            { header: "Status", dataKey: "status", width: 20 },
            ],
            orientation: "portrait",
            headerInfo: {
            printDate: undefined,
            filterDescription, // kita simpan keterangan filter di sini
            },
            headerImage: '/images/headerr.png',
            footerImage: '/images/Footer.png',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole={userRole}>
            <Head title="Dosen" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable
                    title="Dosen"
                    href={`/${userRole}/data-dosen`}
                    columns={columns}
                    data={dosens}
                    showSearch={true}
                    showCreateButton={canCreate}
                    showColumnFilter={true}
                    showDataFilter={true}
                    showPdfExport={true}
                    pdfExportHandler={dosenPdfExportHandler}
                    columnFilters={columnFiltersConfig}
                />
            </div>
        </AppLayout>
    );
}
