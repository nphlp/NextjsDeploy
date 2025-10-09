"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@comps/SHADCN/ui/dropdown-menu";
import { signOut, useSession } from "@lib/authClient";
import { Session } from "@lib/authServer";
import { Loader, LogOut, UserPlus, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ProfileIconProps = {
    serverSession: Session;
};

export default function ProfileIcon(props: ProfileIconProps) {
    const { serverSession } = props;
    const { data: clientSession, isPending } = useSession();
    const session = isPending ? serverSession : clientSession;

    // Logout management
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);

        const { data } = await signOut();

        if (data) {
            router.push("/");
        } else {
            throw new Error("Something went wrong...");
        }

        setTimeout(() => setIsLoading(false), 1000);
    };

    return session ? (
        <DropdownMenu>
            <DropdownMenuTrigger className="text-gray-high hover:text-gray-high hover:bg-gray-light rounded-middle cursor-pointer p-2">
                <UserRound className="size-6" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" className="min-w-[140px]">
                <DropdownMenuItem className="flex gap-4" asChild>
                    <Link aria-label="Profile" href="/profile" className="flex w-full justify-start gap-4">
                        <UserRound className="size-5" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-4" asChild>
                    <button aria-label="Se déconnecter" onClick={handleLogout} className="flex flex-row gap-4">
                        {isLoading ? <Loader className="size-5" /> : <LogOut className="size-5" />}
                        <span>Déconnexion</span>
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ) : (
        <DropdownMenu>
            <DropdownMenuTrigger className="text-gray-high hover:text-gray-high hover:bg-gray-light rounded-middle cursor-pointer p-2">
                <UserRound className="size-6" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" className="min-w-[140px]">
                <DropdownMenuItem className="flex gap-4" asChild>
                    <Link aria-label="Connexion" href="/login" className="flex w-full justify-start gap-4">
                        <UserRound className="size-5" />
                        <span>Connexion</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-4" asChild>
                    <Link aria-label="Inscription" href="/register" className="flex w-full justify-start gap-4">
                        <UserPlus className="size-5" />
                        <span>Inscription</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
