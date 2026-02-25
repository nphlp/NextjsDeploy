"use client";

import "@scalar/api-reference-react/style.css";
import dynamic from "next/dynamic";

const ApiReferenceReact = dynamic(() => import("@scalar/api-reference-react").then((mod) => mod.ApiReferenceReact), {
    ssr: false,
});

export default function ScalarDocs() {
    return (
        <ApiReferenceReact
            configuration={{
                url: "/api/orpc/spec.json",
                theme: "default",
            }}
        />
    );
}
