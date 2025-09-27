"use client";

import Links from "./Header/Links";

export default function Footer() {
    return (
        <footer className="flex items-center justify-center p-6">
            <Links scrollToTop />
        </footer>
    );
}
