import { ReactNode } from "react";

type BProps = {
    children: ReactNode;
};

export default function B(props: BProps) {
    const { children } = props;
    return <span className="font-bold">{children}</span>;
}
