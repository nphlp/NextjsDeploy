"use client";

import { Button } from "@comps/SHADCN/ui/button";
import { signOut } from "@lib/authClient";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

type LogoutProps = {
    children: ReactNode;
};

export default function Logout(props: LogoutProps) {
    const { children } = props;

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);

        const { data } = await signOut();

        if (data) {
            router.push("/");
        } else {
            throw new Error("Something went wrong...");
        }
    };

    return (
        <Button onClick={handleClick} disabled={isLoading}>
            {children}
        </Button>
    );
}
