import type { Metadata } from "next";
import ScalarDocs from "./dynamic-loading";

export const metadata: Metadata = {
    title: "Scalar",
    description: "Interactive API documentation.",
};

export default async function Page() {
    return (
        <div className="bg-background absolute inset-0">
            <h1 className="sr-only">Scalar API Documentation</h1>
            <ScalarDocs />
        </div>
    );
}
