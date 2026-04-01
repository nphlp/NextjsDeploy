import { SMTP_FROM_NAME } from "@lib/env";
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

type EmailType =
    | "verification"
    | "reset"
    | "magic-link"
    | "magic-link-no-account"
    | "change-verification"
    | "change-requested"
    | "change-canceled"
    | "change-completed"
    | "change-success"
    | "password-changed"
    | "totp-enabled"
    | "totp-disabled"
    | "passkey-added"
    | "passkey-deleted"
    | "contact-confirmation"
    | "existing-account";

type EmailTemplateProps = {
    buttonUrl: string;
    emailType: EmailType;
};

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
    "change-verification": {
        preview: "Confirmez votre nouvelle adresse email",
        title: "Changement d\u2019email",
        description: "Veuillez confirmer votre nouvelle adresse email.",
        buttonText: "Confirmer mon email",
        buttonColor: "#dc2626",
    },
    "change-requested": {
        preview: "Un changement d\u2019email a été demandé",
        title: "Changement d\u2019email en cours",
        description:
            "Un changement d\u2019adresse email a été demandé sur votre compte. Si vous n\u2019êtes pas à l\u2019origine de cette demande, contactez le support immédiatement.",
        buttonText: "Contacter le support",
        buttonColor: "#000000",
    },
    "change-completed": {
        preview: "Votre adresse email a été modifiée",
        title: "Email modifié",
        description:
            "L\u2019adresse email de votre compte a été modifiée avec succès. Si vous n\u2019êtes pas à l\u2019origine de ce changement, contactez le support immédiatement.",
        buttonText: "Contacter le support",
        buttonColor: "#000000",
    },
    "change-canceled": {
        preview: "Le changement d\u2019email a été annulé",
        title: "Changement annulé",
        description:
            "La demande de changement d\u2019adresse email sur votre compte a été annulée. Aucune modification n\u2019a été effectuée. Si vous n\u2019êtes pas à l\u2019origine de cette annulation, contactez le support.",
        buttonText: "Contacter le support",
        buttonColor: "#000000",
    },
    "change-success": {
        preview: "Votre nouvelle adresse email est confirmée",
        title: "Bienvenue !",
        description:
            "Votre nouvelle adresse email a été confirmée avec succès. Vous pouvez désormais l\u2019utiliser pour vous connecter.",
        buttonText: "Accéder au profil",
        buttonColor: "#000000",
    },
    "password-changed": {
        preview: "Votre mot de passe a été modifié",
        title: "Mot de passe modifié",
        description:
            "Le mot de passe de votre compte a été modifié avec succès. Si vous n\u2019êtes pas à l\u2019origine de ce changement, contactez le support immédiatement.",
        buttonText: "Contacter le support",
        buttonColor: "#000000",
    },
    "totp-enabled": {
        preview: "L\u2019authentification à deux facteurs a été activée",
        title: "2FA activée",
        description:
            "L\u2019authentification à deux facteurs (TOTP) a été activée sur votre compte. Si vous n\u2019êtes pas à l\u2019origine de cette action, contactez le support immédiatement.",
        buttonText: "Contacter le support",
        buttonColor: "#000000",
    },
    "totp-disabled": {
        preview: "L\u2019authentification à deux facteurs a été désactivée",
        title: "2FA désactivée",
        description:
            "L\u2019authentification à deux facteurs (TOTP) a été désactivée sur votre compte. Si vous n\u2019êtes pas à l\u2019origine de cette action, contactez le support immédiatement.",
        buttonText: "Contacter le support",
        buttonColor: "#000000",
    },
    "passkey-added": {
        preview: "Une nouvelle clé d\u2019accès a été ajoutée",
        title: "Clé d\u2019accès ajoutée",
        description:
            "Une nouvelle clé d\u2019accès (passkey) a été ajoutée à votre compte. Si vous n\u2019êtes pas à l\u2019origine de cette action, contactez le support immédiatement.",
        buttonText: "Contacter le support",
        buttonColor: "#000000",
    },
    "passkey-deleted": {
        preview: "Une clé d\u2019accès a été supprimée",
        title: "Clé d\u2019accès supprimée",
        description:
            "Une clé d\u2019accès (passkey) a été supprimée de votre compte. Si vous n\u2019êtes pas à l\u2019origine de cette action, contactez le support immédiatement.",
        buttonText: "Contacter le support",
        buttonColor: "#000000",
    },
    "contact-confirmation": {
        preview: "Votre message a bien été envoyé",
        title: "Message envoyé",
        description:
            "Nous avons bien reçu votre message et reviendrons vers vous dès que possible. Merci de nous avoir contactés.",
        buttonText: "Retour au site",
        buttonColor: "#000000",
    },
    "existing-account": {
        preview: "Tentative de création de compte",
        title: "Vous avez déjà un compte",
        description:
            "Une tentative de création de compte a été faite avec cette adresse email. Si c'est vous, connectez-vous ou réinitialisez votre mot de passe.",
        buttonText: "Se connecter",
        buttonColor: "#000000",
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
                            <Text className="m-0 text-lg font-bold text-white">{SMTP_FROM_NAME}</Text>
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
                                © {new Date().getFullYear()} {SMTP_FROM_NAME}. Tous droits réservés.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
