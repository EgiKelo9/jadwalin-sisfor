import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';

export function UserInfo({ user, showEmail = false }: { user: any; showEmail?: boolean }) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                {user.foto ? (
                    <AvatarImage src={user.foto ?? window.location.origin + '/images/blank-profile-picture.webp'} alt={user.nama} />
                ) : <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                        {getInitials(user.nama)}
                    </AvatarFallback>
                }
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.nama}</span>
                {showEmail && <span className="truncate text-xs text-muted-foreground">{user.email}</span>}
            </div>
        </>
    );
}
