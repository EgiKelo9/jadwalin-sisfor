import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookMarked, CalendarCheck2, DoorOpen, GraduationCap, House, ScrollText, Settings, User } from 'lucide-react';
import AppLogo from './app-logo';

const berandaNavItems: NavItem[] = [
    {
        title: 'Beranda',
        href: '/beranda',
        icon: House,
    },
];

const jadwalNavItems: NavItem[] = [
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
];

const sumberDayaNavItems: NavItem[] = [
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
];

const penggunaNavItems: NavItem[] = [
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
        href: '/peran-dan-akses',
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
                <NavMain items={berandaNavItems.map(item => ({
                    ...item,
                    href: `/${userRole}${item.href}`,
                }))} />
                <NavMain title="Jadwal" items={jadwalNavItems.map(item => ({
                    ...item,
                    href: `/${userRole}${item.href}`,
                }))} />
                <NavMain title="Sumber Daya" items={sumberDayaNavItems.map(item => ({
                    ...item,
                    href: `/${userRole}${item.href}`,
                }))} />
                <NavMain title="Pengguna" items={penggunaNavItems.map(item => ({
                    ...item,
                    href: `/${userRole}${item.href}`,
                }))} />
            </SidebarContent>

            <SidebarFooter>
                {userRole === 'admin' && (
                    <NavMain items={footerNavItems.map(item => ({
                        ...item,
                        href: `/${userRole}${item.href}`,
                    }))} />
                )}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
