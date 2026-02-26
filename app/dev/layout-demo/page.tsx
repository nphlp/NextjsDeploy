import Main from "@core/Main";
import { IS_DEV } from "@lib/env";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Content from "./_components/content";

export const metadata: Metadata = {
    title: "Layout",
    description: "Layout and spacing demo.",
};

export default function Page() {
    if (!IS_DEV) notFound();

    return (
        <Main>
            <h1 className="text-3xl font-bold">Welcome to Cubiing</h1>
            <Content />
        </Main>
    );
}
