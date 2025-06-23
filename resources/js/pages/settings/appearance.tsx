import { Head, usePage } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem, SharedData } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengaturan',
        href: '/settings/profile',
    },
    {
        title: 'Tampilan',
        href: '/settings/appearance',
    },
];

export default function Appearance() {
    const { auth } = usePage<SharedData>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole={auth.user.role}>
            <Head title="Pengaturan Tampilan" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Pengaturan Tampilan" description="Atur preferensi tampilan pada akun Anda" />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
