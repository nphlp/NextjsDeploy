import Link from "@comps/atoms/button/link";
import { Plus } from "lucide-react";

export default function AddFruitButton() {
    return (
        <Link
            label="Create a fruit"
            href="/fruit/create"
            colors="outline"
            padding="sm"
            className="max-2xs:text-xs max-2xs:py-1"
        >
            <Plus className="size-4 flex-none" />
            Ajouter un fruit
        </Link>
    );
}
