"use client";

import { Link } from "@atoms/button";
import { ExternalLink } from "lucide-react";
import { Route } from "next";
import { useQueryParams } from "../_lib/use-query-params";
import { getEmailProvider } from "../_utils/email-providers";

export default function EmailProviderLink() {
    const { email } = useQueryParams();
    const provider = getEmailProvider(email);

    if (!provider) {
        return (
            <p className="text-center text-sm text-gray-400">
                Consultez votre bo&icirc;te de r&eacute;ception pour finaliser l&apos;inscription.
            </p>
        );
    }

    return (
        <Link
            href={provider.url as Route}
            label={`Ouvrir ${provider.name}`}
            colors="outline"
            className="w-full text-gray-700"
            legacyProps={{ target: "_blank" }}
        >
            Ouvrir {provider.name}
            <ExternalLink className="size-4" />
        </Link>
    );
}
