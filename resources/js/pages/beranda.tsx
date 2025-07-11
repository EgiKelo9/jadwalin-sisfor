import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import Schedule from './dashboard/Schedule';
import Calendar from './dashboard/Calendar';

export default function Dashboard({ userRole }: { userRole: string }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: userRole.charAt(0).toUpperCase() + userRole.slice(1),
            href: `/${userRole}/beranda`,
        },
        {
            title: 'Beranda',
            href: `/${userRole}/beranda`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole={userRole}>
            <Head title="Beranda" />
            <div className="flex w-full h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="grid w-full gap-4 md:grid-cols-[3fr_1fr]">
                    <div>
                        <Schedule />
                    </div>
                    <div>
                        <Calendar />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
