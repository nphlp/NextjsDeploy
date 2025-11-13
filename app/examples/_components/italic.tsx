import { ReactNode } from "react";

type IProps = {
    children: ReactNode;
};

export default function I(props: IProps) {
    const { children } = props;
    return <span className="italic">{children}</span>;
}
