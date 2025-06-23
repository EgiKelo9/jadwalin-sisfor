import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookMarked, CalendarCheck2, DoorOpen, GraduationCap, House, ScrollText, Settings, User } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Beranda',
        href: '/beranda',
        icon: House,
    },
    {
        title: 'Jadwal Perkuliahan',
        href: '/jadwal-perkuliahan',
        icon: CalendarCheck2,
    },
    {
        title: 'Peminjaman Kelas',
        href: '/peminjaman-kelas',
        icon: BookMarked,
    },
    {
        title: 'Mata Kuliah',
        href: '/mata-kuliah',
        icon: ScrollText,
    },
    {
        title: 'Ruang Kelas',
        href: '/ruang-kelas',
        icon: DoorOpen,
    },
    {
        title: 'Data Dosen',
        href: '/data-dosen',
        icon: GraduationCap,
    },
    {
        title: 'Data Mahasiswa',
        href: '/data-mahasiswa',
        icon: User,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Peran dan Akses',
        href: '/admin/peran-dan-akses',
        icon: Settings,
    },
];

export function AppSidebar({ userRole }: { userRole?: string }) {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild variant={'default'}>
                            <Link href={`/${userRole}/beranda`} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems.map(item => ({
                    ...item,
                    href: `/${userRole}${item.href}`,
                }))} />
            </SidebarContent>

            <SidebarFooter>
                {userRole === 'admin' && (
                    <NavFooter items={footerNavItems} className="mt-auto" />
                )}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
