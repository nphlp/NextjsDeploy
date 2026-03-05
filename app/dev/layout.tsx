import type { Metadata } from "next";
import { ReactNode } from "react";
import Sidebar from "./_components/sidebar";

export const metadata: Metadata = {
    title: {
        template: "%s • Dev",
        default: "Dev",
    },
    description: "Development tools and component showcases.",
};

type LayoutProps = {
    children: ReactNode;
};

export default async function Layout(props: LayoutProps) {
    const { children } = props;

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-full">{children}</div>
        </div>
    );
}
