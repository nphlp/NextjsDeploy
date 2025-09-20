import ThemeToggle from "./theme/themeToggle";

export default function Header() {
    return (
        <header className="flex w-full items-center justify-end px-5 py-3">
            <ThemeToggle />
        </header>
    );
}
