import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { createAksesRoleColumns } from './column-index';
import { DataTable, ColumnFilterConfig } from '@/components/ui/data-table';

export const columnFiltersConfig: ColumnFilterConfig[] = [
    {
        columnId: 'nama_role',
        label: 'Peran',
        type: 'select',
    },
    {
        columnId: 'akses',
        label: 'Akses',
        type: 'select',
    },
];

interface AksesRoleTableProps {
    aksesRole: any[];
    userRole: string;
    canUpdate?: boolean;
}

export default function AksesRoleIndex({ aksesRole, userRole, canUpdate }: AksesRoleTableProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: userRole.charAt(0).toUpperCase() + userRole.slice(1),
            href: `/${userRole}/beranda`,
        },
        {
            title: 'Peran dan Akses',
            href: `/${userRole}/peran-dan-akses`,
        },
    ];

    // Create columns with permissions
    const columns = createAksesRoleColumns(userRole, canUpdate);

    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole={userRole}>
            <Head title="Peran dan Akses" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable
                    title="Peran dan Akses"
                    href={`/${userRole}/peran-dan-akses`}
                    columns={columns}
                    data={aksesRole}
                    showSearch={true}
                    showCreateButton={false}
                    showColumnFilter={true}
                    showDataFilter={true}
                    showActiveTab={true}
                    activeTab={['General', 'Khusus']}
                    defaultTab='General'
                    columnFilters={columnFiltersConfig}
                />
            </div>
        </AppLayout>
    );
}
