import Main from "@core/Main";
import type { Metadata } from "next";
import Content from "./_components/content";

export const metadata: Metadata = {
    title: "Layout",
    description: "Layout and spacing demo.",
};

export default async function Page() {
    return (
        <Main>
            <h1 className="text-3xl font-bold">Welcome to Cubiing</h1>
            <Content />
        </Main>
    );
}
