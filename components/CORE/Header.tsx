import { getSession } from "@lib/authServer";
import Links from "./Header/Links";
import ProfileIcon from "./Header/ProfileIcon";
import ThemeDropdown from "./theme/theme-dropdown";

export default async function Header() {
    const session = await getSession();

    return (
        <header className="flex w-full items-center justify-end gap-4 px-5 py-3">
            <Links />
            <ProfileIcon serverSession={session} />
            <ThemeDropdown />
        </header>
    );
}
