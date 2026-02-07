import { IS_DEV } from "@lib/env";
import { notFound } from "next/navigation";
import ScalarDocs from "./dynamic-loading";

export default function Page() {
    if (!IS_DEV) return notFound();

    return (
        <div className="bg-background absolute inset-0">
            <ScalarDocs />
        </div>
    );
}
