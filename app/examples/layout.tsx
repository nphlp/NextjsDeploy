import { ReactNode } from "react";
import Navigation from "./_components/navigation";
import Sidebar from "./_components/sidebar";

type LayoutProps = {
    children: ReactNode;
};

export default function Layout(props: LayoutProps) {
    const { children } = props;

    const sideBarWidth = 250; // in px

    return (
        <div className="flex w-full flex-1 flex-row">
            <Sidebar sideBarWidth={sideBarWidth} />
            <div className="flex w-full flex-col items-center justify-center p-7">{children}</div>
            <Navigation sideBarWidth={sideBarWidth} />
        </div>
    );
}
