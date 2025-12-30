"use client";

import { ButtonItem, Popup, Portal, Positioner, Trigger } from "@comps/atoms/menu/atoms";
import Menu from "@comps/atoms/menu/menu";
import { signOut, useSession } from "@lib/auth-client";
import { Session } from "@lib/auth-server";
import { Loader, LogOut, UserPlus, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type MenuProfileProps = {
    serverSession: Session;
};

export default function MenuProfile(props: MenuProfileProps) {
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

    return (
        <Menu>
            <Trigger className="border-none bg-transparent px-2 hover:bg-gray-100">
                <UserRound className="size-6" />
            </Trigger>
            <Portal>
                <Positioner>
                    <Popup>
                        {session ? (
                            <>
                                <Link href="/profile" aria-label="Profile">
                                    <ButtonItem value="profile">
                                        <UserRound className="size-4" />
                                        <span>Profile</span>
                                    </ButtonItem>
                                </Link>
                                <ButtonItem value="logout" onItemClick={handleLogout}>
                                    {isLoading ? (
                                        <Loader className="size-4 animate-spin" />
                                    ) : (
                                        <LogOut className="size-4" />
                                    )}
                                    <span>Déconnexion</span>
                                </ButtonItem>
                            </>
                        ) : (
                            <>
                                <Link href="/login" aria-label="Connexion">
                                    <ButtonItem value="login">
                                        <UserRound className="size-4" />
                                        <span>Connexion</span>
                                    </ButtonItem>
                                </Link>
                                <Link href="/register" aria-label="Inscription">
                                    <ButtonItem value="register">
                                        <UserPlus className="size-4" />
                                        <span>Inscription</span>
                                    </ButtonItem>
                                </Link>
                            </>
                        )}
                    </Popup>
                </Positioner>
            </Portal>
        </Menu>
    );
}
