import Link from "@comps/UI/button/link";
import { UserRound } from "lucide-react";
import Links from "./Header/Links";
import ThemeDropdown from "./theme/theme-dropdown";

export default function Header() {
    return (
        <header className="flex w-full items-center justify-end gap-4 px-5 py-3">
            <Links />
            <Link label="Connexion" href="/login" variant="ghost" className="p-2">
                <UserRound className="size-6" />
            </Link>
            <ThemeDropdown />
        </header>
    );
}
