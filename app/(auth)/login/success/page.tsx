import { Link } from "@atoms/button";
import Card from "@atoms/card";
import Main from "@core/Main";
import { CircleCheck, ExternalLink, Mail } from "lucide-react";
import EmailProviderLink from "./_components/email-provider-link";
import { QueryParamsCachedType, queryParamsCached } from "./_lib/query-params";

type PageProps = {
    searchParams: Promise<QueryParamsCachedType>;
};

export default async function Page(props: PageProps) {
    const { searchParams } = props;

    const { email } = await queryParamsCached.parse(searchParams);

    return (
        <Main>
            <Card className="max-w-80">
                <div className="flex flex-col items-center gap-6">
                    {/* Icon */}
                    <div className="flex size-16 items-center justify-center rounded-full bg-green-100">
                        <CircleCheck className="size-8 text-green-600" />
                    </div>

                    {/* Title */}
                    <div className="space-y-2 text-center">
                        <h3 className="text-xl font-semibold">Lien magique envoy&eacute; !</h3>
                        <p className="text-sm text-gray-500">Vous allez recevoir un lien de connexion par email.</p>
                    </div>

                    {/* Info */}
                    <div className="w-full space-y-3 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
                        <div className="flex items-start gap-2.5">
                            <Mail className="mt-0.5 size-4 shrink-0 text-gray-400" />
                            <p>Cliquez sur le lien dans l&apos;email pour vous connecter automatiquement.</p>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <ExternalLink className="mt-0.5 size-4 shrink-0 text-gray-400" />
                            <p>Vous pouvez fermer cette page et vous rendre sur votre application d&apos;email.</p>
                        </div>
                    </div>

                    <div className="flex w-full flex-col items-center gap-2">
                        {/* Email provider link */}
                        <EmailProviderLink email={email} />

                        {/* Back to login */}
                        <Link
                            href="/login"
                            label="Retour à la connexion"
                            className="text-sm text-gray-500"
                            colors="link"
                        >
                            Retour &agrave; la connexion
                        </Link>
                    </div>
                </div>
            </Card>
        </Main>
    );
}
