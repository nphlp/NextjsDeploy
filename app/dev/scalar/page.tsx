import { IS_DEV } from "@lib/env";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ScalarDocs from "./dynamic-loading";

export const metadata: Metadata = {
    title: "Scalar",
    description: "Interactive API documentation.",
};

export default function Page() {
    if (!IS_DEV) return notFound();

    return (
        <div className="bg-background absolute inset-0">
            <ScalarDocs />
        </div>
    );
}
