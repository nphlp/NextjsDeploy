import Main from "@core/Main";
import { IS_DEV } from "@lib/env";
import { notFound } from "next/navigation";
import Content from "./_components/content";

export default function Page() {
    if (!IS_DEV) notFound();

    return (
        <Main>
            <h1 className="text-3xl font-bold">Welcome to Cubiing</h1>
            <Content />
        </Main>
    );
}
