import type { Metadata } from "next";
import { assertDevAccess } from "../_lib/dev-guard";
import ScalarDocs from "./dynamic-loading";

export const metadata: Metadata = {
    title: "Scalar",
    description: "Interactive API documentation.",
};

export default async function Page() {
    await assertDevAccess();

    return (
        <div className="bg-background absolute inset-0">
            <ScalarDocs />
        </div>
    );
}
