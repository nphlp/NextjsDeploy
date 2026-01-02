"use client";

import Card from "@atoms/card";
import Button from "@comps/atoms/button/button";
import Main from "@core/Main";
import { useEffect } from "react";

type ErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function Error(props: ErrorProps) {
    const { error, reset } = props;

    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <Main>
            <div className="w-full max-w-150 space-y-4">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Oups!</h2>
                    <p>Something went wrong. Please try again.</p>
                </div>
                <Card>{error.message}</Card>
                <div className="flex justify-center">
                    <Button label="Try Again" onClick={reset} />
                </div>
            </div>
        </Main>
    );
}
