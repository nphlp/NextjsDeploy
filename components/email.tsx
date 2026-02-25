import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Tailwind,
    Text,
} from "@react-email/components";

type EmailType = "verification" | "change" | "reset" | "magic-link" | "magic-link-no-account";

type EmailTemplateProps = {
    buttonUrl: string;
    emailType: EmailType;
};

const APP_NAME = "Nextjs Deploy";

const content: Record<
    EmailType,
    {
        preview: string;
        title: string;
        description: string;
        buttonText: string;
        buttonColor: string;
    }
> = {
    verification: {
        preview: "Vérifiez votre adresse email",
        title: "Bienvenue !",
        description: "Veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous.",
        buttonText: "Vérifier mon email",
        buttonColor: "#000000",
    },
    change: {
        preview: "Confirmez votre nouvelle adresse email",
        title: "Changement d\u2019email",
        description: "Veuillez confirmer votre nouvelle adresse email.",
        buttonText: "Confirmer mon email",
        buttonColor: "#dc2626",
    },
    reset: {
        preview: "Réinitialisez votre mot de passe",
        title: "Réinitialisation du mot de passe",
        description:
            "Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe. Ce lien expire dans 1 heure.",
        buttonText: "Réinitialiser mon mot de passe",
        buttonColor: "#2563eb",
    },
    "magic-link": {
        preview: "Votre lien de connexion",
        title: "Connexion rapide",
        description: "Cliquez sur le bouton ci-dessous pour vous connecter. Ce lien expire dans 5 minutes.",
        buttonText: "Se connecter",
        buttonColor: "#7c3aed",
    },
    "magic-link-no-account": {
        preview: "Créez votre compte",
        title: "Créer un compte",
        description:
            "Une demande de connexion a été faite avec cette adresse email, mais aucun compte n\u2019y est associé. Inscrivez-vous pour commencer !",
        buttonText: "S\u2019inscrire",
        buttonColor: "#1f2937",
    },
};

export default function EmailTemplate(props: EmailTemplateProps) {
    const { buttonUrl, emailType } = props;
    const { preview, title, description, buttonText, buttonColor } = content[emailType];

    return (
        <Html>
            <Head />
            <Preview>{preview}</Preview>
            <Tailwind>
                <Body className="bg-gray-100 font-sans">
                    <Container className="mx-auto my-10 max-w-120 rounded-lg bg-white shadow-sm">
                        {/* Header */}
                        <Section className="rounded-t-lg bg-gray-900 px-8 py-6 text-center">
                            <Text className="m-0 text-lg font-bold text-white">{APP_NAME}</Text>
                        </Section>

                        {/* Content */}
                        <Section className="px-8 py-10">
                            <Heading className="m-0 mb-4 text-center text-xl font-bold text-gray-900">{title}</Heading>
                            <Text className="mb-8 text-center text-sm leading-6 text-gray-600">{description}</Text>
                            <Section className="text-center">
                                <Button
                                    className="inline-block rounded-md px-6 py-3 text-center text-sm font-semibold text-white"
                                    href={buttonUrl}
                                    style={{ backgroundColor: buttonColor }}
                                >
                                    {buttonText}
                                </Button>
                            </Section>
                            <Text className="mt-6 text-center text-xs leading-5 break-all text-gray-400">
                                <span className="block">
                                    Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :
                                </span>
                                <Link href={buttonUrl} className="text-gray-400 underline">
                                    {buttonUrl}
                                </Link>
                            </Text>
                        </Section>

                        {/* Footer */}
                        <Section className="px-8 pb-8">
                            <Hr className="mb-6 border-gray-200" />
                            <Text className="m-0 mb-2 text-center text-xs text-gray-400">
                                <Link href="#" className="text-gray-400 underline">
                                    Site web
                                </Link>
                                {" · "}
                                <Link href="#" className="text-gray-400 underline">
                                    Mentions légales
                                </Link>
                                {" · "}
                                <Link href="#" className="text-gray-400 underline">
                                    Politique de confidentialité
                                </Link>
                            </Text>
                            <Text className="m-0 text-center text-xs text-gray-400">
                                © {new Date().getFullYear()} {APP_NAME}. Tous droits réservés.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
