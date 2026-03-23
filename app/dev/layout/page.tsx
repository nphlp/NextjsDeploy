import Main from "@core/Main";
import type { Metadata } from "next";
import Content from "./_components/content";

export const metadata: Metadata = {
    title: "Layout",
    description: "Main layout component demo — centering and scroll behavior.",
};

const LOREM =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

export default async function Page() {
    return (
        <Main>
            <div className="flex w-full max-w-100 flex-col gap-4">
                <h1 className="text-2xl font-bold">Main Layout</h1>
                <p className="text-sm text-gray-500">
                    The <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{"<Main>"}</code> component uses two
                    nested flex containers. The outer div has{" "}
                    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">justify-start</code> with{" "}
                    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">minHeight: 100dvh - header</code>. The
                    inner div has <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">flex-1</code> and centers
                    content via <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">justifyContent</code>.
                </p>
                <p className="text-sm text-gray-500">
                    When content is shorter than the viewport, the inner div stretches and centers everything
                    vertically. When content overflows, the outer div&apos;s{" "}
                    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">justify-start</code> ensures scroll
                    starts from the top — without it, centered content would clip above the fold.
                </p>

                <Content lorem={LOREM} />
            </div>
        </Main>
    );
}
