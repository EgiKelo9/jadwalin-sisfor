import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { MataKuliahColumns } from './column';
import { DataTable, ColumnFilterConfig } from '@/components/ui/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/beranda',
    },
    {
        title: 'Mata Kuliah',
        href: '/admin/mata-kuliah',
    },
];

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
}

export default function RuangKelas({ mataKuliahs }: MataKuliahTableProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole='admin'>
            <Head title="Mata Kuliah" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable
                    title="Mata Kuliah"
                    href="/admin/mata-kuliah"
                    columns={MataKuliahColumns}
                    data={mataKuliahs}
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
