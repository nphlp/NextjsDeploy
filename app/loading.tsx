import { Spinner } from "@comps/SHADCN/ui/spinner";

export default function Loading() {
    return (
        <div className="flex h-full items-center justify-center">
            <Spinner className="size-6" />
        </div>
    );
}
