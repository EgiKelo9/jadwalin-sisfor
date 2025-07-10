import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { createAksesRoleColumns } from './column-custom';
import { DataTable } from '@/components/ui/data-table';

interface AksesRoleTableProps {
    aksesRole: any[];
    userRole: string;
    canUpdate?: boolean;
}

export default function AksesRoleCustom({ aksesRole, userRole, canUpdate }: AksesRoleTableProps) {
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
                    showDataFilter={false}
                    activeTab={['General', 'Khusus']}
                    defaultTab='Khusus'
                />
            </div>
        </AppLayout>
    );
}
