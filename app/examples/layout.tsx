import { ReactNode } from "react";
import Navigation from "./_components/navigation";

type LayoutProps = {
    children: ReactNode;
};

export default function Layout(props: LayoutProps) {
    const { children } = props;

    return (
        <>
            {children}
            <Navigation />
        </>
    );
}
