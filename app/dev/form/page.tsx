import Card from "@atoms/card";
import Main from "@core/Main";
import type { Metadata } from "next";
import FormExample from "./_components/form-example";

export const metadata: Metadata = {
    title: "Form",
    description: "Form example with useForm hook.",
};

export default async function Page() {
    return (
        <Main>
            <Card className="max-w-80">
                <div className="space-y-2 text-center">
                    <h3 className="text-xl font-semibold">Form Example</h3>
                    <p className="text-sm text-gray-500">Saisissez vos informations.</p>
                </div>
                <FormExample />
            </Card>
        </Main>
    );
}
