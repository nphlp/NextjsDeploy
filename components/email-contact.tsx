import { SMTP_FROM_NAME } from "@lib/env";
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Tailwind, Text } from "@react-email/components";

type ContactEmailTemplateProps = {
    subject: string;
    message: string;
    senderEmail: string;
};

export default function ContactEmailTemplate(props: ContactEmailTemplateProps) {
    const { subject, message, senderEmail } = props;

    return (
        <Html>
            <Head />
            <Preview>Contact : {subject}</Preview>
            <Tailwind>
                <Body className="bg-gray-100 font-sans">
                    <Container className="mx-auto my-10 max-w-120 rounded-lg bg-white shadow-sm">
                        {/* Header */}
                        <Section className="rounded-t-lg bg-gray-900 px-8 py-6 text-center">
                            <Text className="m-0 text-lg font-bold text-white">{SMTP_FROM_NAME}</Text>
                        </Section>

                        {/* Content */}
                        <Section className="px-8 py-10">
                            <Heading className="m-0 mb-4 text-center text-xl font-bold text-gray-900">
                                Nouveau message
                            </Heading>

                            {/* Subject */}
                            <Text className="mb-1 text-xs font-semibold text-gray-500 uppercase">Sujet</Text>
                            <Text className="mt-0 mb-4 text-sm text-gray-900">{subject}</Text>

                            {/* Sender */}
                            <Text className="mb-1 text-xs font-semibold text-gray-500 uppercase">Email</Text>
                            <Text className="mt-0 mb-4 text-sm text-gray-900">{senderEmail}</Text>

                            {/* Message */}
                            <Text className="mb-1 text-xs font-semibold text-gray-500 uppercase">Message</Text>
                            <Text className="m-0 rounded-md bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                                {message}
                            </Text>
                        </Section>

                        {/* Footer */}
                        <Section className="px-8 pb-8">
                            <Hr className="mb-6 border-gray-200" />
                            <Text className="m-0 text-center text-xs text-gray-400">
                                &copy; {new Date().getFullYear()} {SMTP_FROM_NAME}. Tous droits r&eacute;serv&eacute;s.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
