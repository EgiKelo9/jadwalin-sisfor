import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { RuangKelasColumns } from './column';
import { DataTable, ColumnFilterConfig } from '@/components/ui/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/beranda',
    },
    {
        title: 'Ruang Kelas',
        href: '/admin/ruang-kelas',
    },
];

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
}

export default function RuangKelas({ ruangKelas }: RuangKelasTableProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole='admin'>
            <Head title="Ruang Kelas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable
                    title="Ruang Kelas"
                    href="/admin/ruang-kelas"
                    columns={RuangKelasColumns}
                    data={ruangKelas}
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
