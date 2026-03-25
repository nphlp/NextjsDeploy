import Card from "@atoms/card";
import Main from "@core/Main";
import type { Metadata } from "next";
import ContactForm from "./_components/contact-form";

export const metadata: Metadata = {
    title: "Contact",
    description: "Contactez-nous pour toute question ou suggestion.",
};

export default function Page() {
    return (
        <Main>
            <Card className="max-w-80">
                <div className="space-y-2 text-center">
                    <h1 className="text-xl font-semibold">Nous contacter</h1>
                    <p className="text-sm text-gray-500">
                        Une question, un probl&egrave;me ou une suggestion ? &Eacute;crivez-nous.
                    </p>
                </div>
                <ContactForm />
            </Card>
        </Main>
    );
}
