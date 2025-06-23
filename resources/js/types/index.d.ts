import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
    mahasiswa?: Mahasiswa;
    dosen?: Dosen;
    admin?: Admin;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    email: string;
    role: 'mahasiswa' | 'dosen' | 'admin';
    email_verified_at: string | null;
    mahasiswa_id?: number;
    dosen_id?: number;
    admin_id?: number;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Mahasiswa {
    id: number;
    nim: string;
    nama: string;
    role: 'mahasiswa';
    email: string;
    telepon: string;
    alamat: string;
    foto?: string;
    status: 'aktif' | 'nonaktif';
    [key: string]: unknown; // This allows for additional properties...
}

export interface Dosen {
    id: number;
    nip: string;
    nidn: string;
    nama: string;
    role: 'dosen';
    email: string;
    telepon: string;
    alamat: string;
    foto?: string;
    status: 'aktif' | 'nonaktif';
    [key: string]: unknown; // This allows for additional properties...
}

export interface Admin {
    id: number;
    nip: string;
    nama: string;
    role: 'admin';
    email: string;
    telepon: string;
    alamat: string;
    foto?: string;
    status: 'aktif' | 'nonaktif';
    [key: string]: unknown; // This allows for additional properties...
}