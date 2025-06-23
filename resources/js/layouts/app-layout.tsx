import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    userRole?: string;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, userRole, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} userRole={userRole} {...props}>
        {children}
    </AppLayoutTemplate>
);
