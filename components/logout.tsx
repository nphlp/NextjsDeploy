"use client";

import { signOut } from "@lib/auth-client";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import Button from "./atoms/button/button";

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
        <Button label="Logout" onClick={handleClick} isLoading={isLoading}>
            {children}
        </Button>
    );
}
