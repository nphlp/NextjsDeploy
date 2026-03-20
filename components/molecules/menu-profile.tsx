"use client";

import Menu, { Arrow, Item, Popup, Portal, Positioner, Trigger } from "@atoms/menu";
import { signOut, useSession } from "@lib/auth-client";
import { Loader, LogOut, UserPlus, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function MenuProfile() {
    const { data: session } = useSession();

    // Logout management
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);

        const { data } = await signOut();

        if (data) {
            // Hard navigation to clear client state after logout
            window.location.href = "/";
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
                        <Arrow />
                        {session ? (
                            <>
                                <Link href="/profile" aria-label="Profile">
                                    <Item>
                                        <UserRound className="size-4" />
                                        <span>Profile</span>
                                    </Item>
                                </Link>
                                <Item onClick={handleLogout}>
                                    {isLoading ? (
                                        <Loader className="size-4 animate-spin" />
                                    ) : (
                                        <LogOut className="size-4" />
                                    )}
                                    <span>Déconnexion</span>
                                </Item>
                            </>
                        ) : (
                            <>
                                <Link href="/login" aria-label="Connexion">
                                    <Item>
                                        <UserRound className="size-4" />
                                        <span>Connexion</span>
                                    </Item>
                                </Link>
                                <Link href="/register" aria-label="Inscription">
                                    <Item>
                                        <UserPlus className="size-4" />
                                        <span>Inscription</span>
                                    </Item>
                                </Link>
                            </>
                        )}
                    </Popup>
                </Positioner>
            </Portal>
        </Menu>
    );
}
