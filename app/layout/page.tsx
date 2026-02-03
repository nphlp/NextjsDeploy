import { notFound } from "next/navigation";
import Main from "@/components/main";
import { isDev } from "@/lib/env";
import { debugLayout } from "../layout";
import Content from "./content";

export default function Page() {
    if (!isDev) notFound();

    return (
        <Main>
            <h1 className="text-3xl font-bold">Welcome to Cubiing</h1>
            <Content debugLayout={debugLayout} />
        </Main>
    );
}
