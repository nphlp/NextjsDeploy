"use client";

import { Link } from "@atoms/button";
import Menu, { Arrow, Item, Popup, Portal, Positioner, Trigger } from "@atoms/menu";
import { linksToRender } from "@core/header-links";
import { useSession } from "@lib/auth-client";
import cn from "@lib/cn";
import { Menu as MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MobileNavigation() {
    const { data: session } = useSession();
    const path = usePathname();

    const isDev = process.env.NODE_ENV === "development";
    const isAdmin = session?.user.role === "ADMIN";

    const links = linksToRender({ session, isDev, isAdmin });

    return (
        <Menu>
            <Trigger className="border-none bg-transparent px-2 hover:bg-gray-100">
                <MenuIcon className="size-6" />
            </Trigger>
            <Portal>
                <Positioner align="start">
                    <Popup className="w-40">
                        <Arrow />
                        {links.map(({ href, label, icon: Icon }) => (
                            <Link label={label} key={href} href={href} className="w-full" noStyle>
                                <Item>
                                    <Icon className="size-4" />
                                    <span className={cn(path === href && "font-bold")}>{label}</span>
                                </Item>
                            </Link>
                        ))}
                    </Popup>
                </Positioner>
            </Portal>
        </Menu>
    );
}
