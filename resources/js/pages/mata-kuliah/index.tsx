import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { createMataKuliahColumns } from './column';
import { DataTable, ColumnFilterConfig } from '@/components/ui/data-table';

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
}

export default function MataKuliah({ mataKuliahs, userRole, canCreate, canUpdate, canDelete }: MataKuliahTableProps) {
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
    const columns = createMataKuliahColumns(userRole, canUpdate, canDelete);

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
                    columnFilters={columnFiltersConfig}
                />
            </div>
        </AppLayout>
    );
}
