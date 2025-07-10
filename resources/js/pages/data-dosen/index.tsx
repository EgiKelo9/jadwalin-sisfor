import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { createDosenColumns } from './column';
import { DataTable, ColumnFilterConfig } from '@/components/ui/data-table';

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
                    columnFilters={columnFiltersConfig}
                />
            </div>
        </AppLayout>
    );
}
