import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md text-sidebar-primary-foreground">
                <AppLogoIcon className="size-8 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-lg text-[#13686D] dark:text-white">
                <span className="mb-0.5 truncate leading-none font-bold">JadwalIn</span>
            </div>
        </>
    );
}
