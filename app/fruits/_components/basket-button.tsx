import Link from "@comps/atoms/button/link";
import { ShoppingBasket } from "lucide-react";

export default function BasketButton() {
    return (
        <Link label="My basket" href="/baskets" colors="outline" padding="sm" className="max-2xs:text-xs max-2xs:py-1">
            <ShoppingBasket className="size-4 flex-none" />
            Mon panier
        </Link>
    );
}
