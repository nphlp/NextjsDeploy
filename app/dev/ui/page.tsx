import Main from "@core/Main";
import type { Metadata } from "next";
import { assertDevAccess } from "../_lib/dev-guard";
import ButtonConfig from "./_components/button-config";

export const metadata: Metadata = {
    title: "UI",
    description: "Button variants and configuration playground.",
};

export default async function Page() {
    await assertDevAccess();

    return (
        <Main>
            <ButtonConfig />
        </Main>
    );
}
