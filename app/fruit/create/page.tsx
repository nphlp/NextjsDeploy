import { Link } from "@atoms/button";
import { ChevronRight } from "lucide-react";
import { Suspense } from "react";
import FormCard from "./_components/form-card";

export default async function Page() {
    return (
        <div className="w-full max-w-225 flex-1 space-y-4 px-4 py-4 sm:px-12">
            <h1 className="flex items-center gap-2 text-2xl font-bold">
                <Link label="Back to fruits" href="/fruits" className="text-2xl font-bold" noStyle>
                    Fruits
                </Link>
                <ChevronRight className="size-4" />
                Créer un fruit
            </h1>

            <Suspense>
                <FormCard />
            </Suspense>
        </div>
    );
}
