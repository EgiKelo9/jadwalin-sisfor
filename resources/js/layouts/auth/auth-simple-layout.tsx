import AppLogoIcon from '@/components/app-logo-icon';
import { Link, usePage } from '@inertiajs/react';
import { Auth, type SharedData } from '@/types';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    auth?: Auth;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, auth, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className='border-secondary border-2 rounded-lg shadow-xl dark:shadow-secondary sm:min-w-[32rem] flex justify-center p-8'>
                <div className="w-full max-w-sm">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex flex-col items-center gap-2 font-medium">
                                <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-md">
                                    <AppLogoIcon className="size-12 fill-current text-[var(--foreground)] dark:text-white" />
                                </div>
                                <span className="sr-only">{title}</span>
                            </div>

                            <div className="space-y-2 text-center">
                                <h1 className="text-xl font-bold">{title}</h1>
                                <p className="text-center text-sm text-muted-foreground">{description}</p>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
