import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { createPerubahanJadwalColumns } from './column';
import { DataTable, ColumnFilterConfig } from '@/components/ui/data-table';

export const columnFiltersConfig: ColumnFilterConfig[] = [
    {
        columnId: 'status',
        label: 'Status',
        type: 'select',
        options: ['pending', 'diterima', 'ditolak'],
    },
];

interface PerubahanDaftarJadwalTableProps {
    perubahanJadwals: any[];
    userRole: string;
    canCreate?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
}

export default function PerubahanDaftarJadwal({ perubahanJadwals, userRole, canCreate, canUpdate, canDelete }: PerubahanDaftarJadwalTableProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: userRole.charAt(0).toUpperCase() + userRole.slice(1),
            href: `/${userRole}/beranda`,
        },
        {
            title: 'Jadwal Perkuliahan',
            href: `/${userRole}/jadwal-perkuliahan`,
        },
        {
            title: 'Ajukan Perubahan',
            href: `/${userRole}/jadwal-perkuliahan/ajukan-perubahan-jadwal`,
        },
    ];

    // Create columns with permissions
    const columns = createPerubahanJadwalColumns(userRole, canUpdate, canDelete);

    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole={userRole}>
            <Head title="Perubahan Jadwal Perkuliahan" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable
                    title="Perubahan Jadwal Perkuliahan"
                    href={`/${userRole}/jadwal-perkuliahan/ajukan-perubahan-jadwal`}
                    columns={columns}
                    data={perubahanJadwals}
                    showSearch={true}
                    showCreateButton={canCreate}
                    showColumnFilter={false}
                    showDataFilter={true}
                    columnFilters={columnFiltersConfig}
                    showActiveTab={canUpdate ?? false}
                    activeTab={['Menunggu', 'Dikonfirmasi']}
                    defaultTab='Menunggu'
                />
            </div>
        </AppLayout>
    );
}
