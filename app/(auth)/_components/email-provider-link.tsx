"use client";

import { Link } from "@atoms/button";
import { getEmailProvider } from "@utils/email-providers";
import { ExternalLink } from "lucide-react";
import { Route } from "next";
import { useSuccessQueryParams } from "../_lib/use-success-query-params";

type EmailProviderLinkProps = {
    fallbackMessage: string;
};

export default function EmailProviderLink({ fallbackMessage }: EmailProviderLinkProps) {
    const { email } = useSuccessQueryParams();

    const provider = getEmailProvider(email);

    if (!provider) {
        return <p className="text-center text-sm text-gray-400">{fallbackMessage}</p>;
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
