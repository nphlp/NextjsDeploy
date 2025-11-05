import { notFound } from "next/navigation";
import ScalarDocs from "./dynamic-loading";

export default function Page() {
    if (process.env.NODE_ENV !== "development") return notFound();

    return (
        <div className="bg-background absolute inset-0">
            <ScalarDocs />
        </div>
    );
}
