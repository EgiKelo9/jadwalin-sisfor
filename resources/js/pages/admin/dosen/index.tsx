import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { DosenColumns } from './column';
import { DataTable, ColumnFilterConfig } from '@/components/ui/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/beranda',
    },
    {
        title: 'Dosen',
        href: '/admin/data-dosen',
    },
];

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
}

export default function Dosen({ dosens }: DosenTableProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole='admin'>
            <Head title="Dosen" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable
                    title="Dosen"
                    href="/admin/data-dosen"
                    columns={DosenColumns}
                    data={dosens}
                    showSearch={true}
                    showCreateButton={true}
                    showColumnFilter={true}
                    showDataFilter={true}
                    columnFilters={columnFiltersConfig}
                />
            </div>
        </AppLayout>
    );
}
