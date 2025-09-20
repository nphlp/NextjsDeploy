"use client";

import Button from "@comps/UI/button/button";
import { ArrowUp } from "lucide-react";

export default function Footer() {
    const handleClick = () => {
        const mainId = document.getElementById("main");
        if (mainId) mainId.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="flex items-center justify-center p-6">
            <Button label="Go to top" className={{ button: "gap-2" }} onClick={handleClick} focusVisible>
                <span>Go to top</span>
                <ArrowUp />
            </Button>
        </footer>
    );
}
