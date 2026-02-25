import { ReactNode } from "react";

type SectionProps = {
    title: string;
    children: ReactNode;
};

export default function Section(props: SectionProps) {
    const { title, children } = props;

    return (
        <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <div className="flex flex-wrap gap-8">{children}</div>
        </section>
    );
}
