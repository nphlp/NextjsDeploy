"use client";

import Link from "@comps/SHADCN/components/link";

export default function Unauthorized() {
    return (
        <div className="flex h-full items-center justify-center">
            <div className="max-w-3/4 space-y-4 p-7">
                <h2 className="text-2xl font-bold">Mmm. You&apos;re not authorized</h2>
                <p>Please login with an authorized account before accessing this page.</p>
                <div className="flex flex-row items-center justify-center gap-4">
                    <Link href="/">Go back Home</Link>
                </div>
            </div>
        </div>
    );
}
