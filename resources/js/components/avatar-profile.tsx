import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import type { Auth } from '@/types';

export function AvatarProfile({ auth }: { auth: Auth }) {
    const getInitials = useInitials();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="group relative flex size-12 items-center justify-center rounded-full border border-purple-500/20 bg-zinc-950/40 p-0.5 transition-all duration-300 outline-none hover:border-purple-500/60 hover:bg-purple-950/20 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] focus-visible:ring-1 focus-visible:ring-purple-500 data-[state=open]:border-purple-500/80 data-[state=open]:bg-purple-950/30 data-[state=open]:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                    <div className="absolute inset-0 -z-10 rounded-full bg-purple-500/0 opacity-0 blur-md transition-all duration-300 group-hover:bg-purple-500/20 group-hover:opacity-100 group-data-[state=open]:bg-purple-500/30 group-data-[state=open]:opacity-100" />

                    <Avatar className="size-10 overflow-hidden rounded-full border border-zinc-900 transition-transform duration-300 group-hover:scale-105 group-data-[state=open]:scale-105">
                        <AvatarFallback className="rounded-full bg-purple-400/70 font-mono text-[11px] font-bold tracking-wider text-zinc-100 shadow-[inset_0_1px_3px_rgba(255,255,255,0.2)]">
                            {getInitials(auth.user?.name ?? '')}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-56 animate-in rounded-xl border border-purple-500/20 bg-purple-950/90 p-1 text-zinc-200 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md fade-in-50 slide-in-from-top-1"
                align="end"
            >
                {auth.user && <UserMenuContent user={auth.user} />}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
