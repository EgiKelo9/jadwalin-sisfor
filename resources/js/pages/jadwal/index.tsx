import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { createJadwalSementaraColumns } from './column';
import { DataTable, ColumnFilterConfig } from '@/components/ui/data-table';

interface DaftarJadwalTableProps {
    jadwals: any[];
    userRole: string;
    canCreate?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
    canShowAjukan?: boolean;
}

export default function Jadwal({ jadwals, userRole, canCreate, canUpdate, canDelete, canShowAjukan }: DaftarJadwalTableProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: userRole.charAt(0).toUpperCase() + userRole.slice(1),
            href: `/${userRole}/beranda`,
        },
        {
            title: 'Jadwal Perkuliahan',
            href: `/${userRole}/jadwal-perkuliahan`,
        },
    ];

    // Create columns with permissions
    const columns = createJadwalSementaraColumns(userRole, canUpdate, canDelete);

    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole={userRole}>
            <Head title="Jadwal Perkuliahan" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable
                    title="Jadwal Perkuliahan"
                    href={`/${userRole}/jadwal-perkuliahan`}
                    columns={columns}
                    data={jadwals}
                    showSearch={true}
                    showCreateButton={canCreate}
                    showColumnFilter={false}
                    showDataFilter={true}
                    showTopActionButton={canShowAjukan}
                    topActionButtonLabel="Ajukan"
                    topActionButtonHref="ajukan-perubahan-jadwal"
                />
            </div>
        </AppLayout>
    );
}
