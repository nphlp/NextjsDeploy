import { Link } from "@atoms/button";
import { SMTP_HOST } from "@lib/env";
import { getEmailProvider } from "@utils/email-providers";
import { ExternalLink } from "lucide-react";
import { Route } from "next";

type EmailProviderLinkProps = {
    email: string;
};

export default function EmailProviderLink(props: EmailProviderLinkProps) {
    const { email } = props;

    const isMailpit = SMTP_HOST === "localhost";
    const provider = getEmailProvider(email);

    if (!provider) {
        return (
            <p className="text-center text-sm text-gray-400">
                Consultez votre bo&icirc;te de r&eacute;ception pour finaliser l&apos;inscription.
            </p>
        );
    }

    if (isMailpit) {
        return (
            <Link
                href={`http://localhost:8025` as Route}
                label={`Ouvrir Mailpit`}
                colors="outline"
                className="w-full text-gray-700"
                legacyProps={{ target: "_blank" }}
            >
                Ouvrir Mailpit
                <ExternalLink className="size-4" />
            </Link>
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
