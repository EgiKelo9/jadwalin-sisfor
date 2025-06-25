import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { MahasiswaColumns } from './column';
import { DataTable, ColumnFilterConfig } from '@/components/ui/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/beranda',
    },
    {
        title: 'Mahasiswa',
        href: '/admin/data-mahasiswa',
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

interface MahasiswaTableProps {
    mahasiswas: any[];
}

export default function Mahasiswa({ mahasiswas }: MahasiswaTableProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole='admin'>
            <Head title="Mahasiswa" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable
                    title="Mahasiswa"
                    href="/admin/data-mahasiswa"
                    columns={MahasiswaColumns}
                    data={mahasiswas}
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
