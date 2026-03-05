"use client";

import { signOut } from "@lib/auth-client";
import { ReactNode, useState } from "react";
import Button from "./atoms/button/button";

type LogoutProps = {
    children: ReactNode;
};

export default function Logout(props: LogoutProps) {
    const { children } = props;

    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);

        const { data } = await signOut();

        if (data) {
            // Hard navigation to clear client state after logout
            window.location.href = "/";
        } else {
            throw new Error("Something went wrong...");
        }
    };

    return (
        <Button label="Logout" onClick={handleClick} loading={isLoading}>
            {children}
        </Button>
    );
}
