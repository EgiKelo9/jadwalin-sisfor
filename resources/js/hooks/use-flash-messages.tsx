import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useAppearance } from '@/hooks/use-appearance'; // Add this import

export interface FlashMessages {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

export function useFlashMessages() {
    const { props } = usePage<{ flash?: FlashMessages }>();
    const flash = props.flash;

    useEffect(() => {
        // Add a small delay to ensure the page has fully loaded
        const showToasts = () => {
            if (flash?.success) {
                toast.success(flash.success, {
                    duration: 4000,
                    position: 'top-right',
                });
            }
            if (flash?.error) {
                toast.error(flash.error, {
                    duration: 5000,
                    position: 'top-right',
                });
            }
            if (flash?.warning) {
                toast(flash.warning, { 
                    icon: '⚠️',
                    duration: 4000,
                    position: 'top-right',
                });
            }
            if (flash?.info) {
                toast(flash.info, { 
                    icon: 'ℹ️',
                    duration: 4000,
                    position: 'top-right',
                });
            }
        };

        // Use setTimeout to ensure the component is fully mounted
        if (flash && Object.keys(flash).length > 0) {
            const timer = setTimeout(showToasts, 100);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Define props interface for ToasterComponent
    interface ToasterProps {
        isDarkMode?: boolean;
    }

    // Return Toaster component with improved configuration
    const ToasterComponent = ({ isDarkMode: forceDarkMode }: ToasterProps = {}) => {
        // Use appearance hook for theme detection
        const { appearance, updateAppearance } = useAppearance();
        
        // Use forced value if provided, otherwise use appearance from useAppearance
        const isDarkMode = forceDarkMode !== undefined ? forceDarkMode : updateAppearance;

        return (
            <Toaster 
                position="top-right"
                toastOptions={{
                    // Global toast options
                    duration: 4000,
                    style: isDarkMode ? {
                        background: '#1f2937',
                        color: '#f3f4f6',
                        fontSize: '14px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    } : {
                        background: '#ffffff',
                        color: '#374151',
                        fontSize: '14px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: isDarkMode ? '#1f2937' : '#ffffff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: isDarkMode ? '#1f2937' : '#ffffff',
                        },
                    },
                }}
            />
        );
    };

    return { 
        flash,
        ToasterComponent 
    };
}