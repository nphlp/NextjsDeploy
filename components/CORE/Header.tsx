import Links from "./Header/Links";
import ThemeToggle from "./theme/themeToggle";

export default function Header() {
    return (
        <header className="flex w-full items-center justify-end gap-4 px-5 py-3">
            <Links />
            <ThemeToggle />
        </header>
    );
}
