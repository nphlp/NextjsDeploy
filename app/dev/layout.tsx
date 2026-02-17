import { ReactNode } from "react";
import Sidebar from "./_components/sidebar";

type LayoutProps = {
    children: ReactNode;
};

export default function Layout(props: LayoutProps) {
    const { children } = props;

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-full">{children}</div>
        </div>
    );
}
