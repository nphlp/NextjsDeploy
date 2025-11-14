import Link from "@comps/SHADCN/components/link";
import AnchorButton from "./_components/archor-button";
import exampleLinks, { LinkGroupType } from "./_components/link";

export default function Page() {
    return (
        <div className="max-w-[600px] space-y-8 p-7">
            <div>
                <h2 className="text-2xl font-bold">Examples</h2>
                <p>A collection of examples demonstrating various features for this Next.js template.</p>
            </div>
            {exampleLinks.map((group, index) => (
                <LinkGroup key={index} group={group} />
            ))}
        </div>
    );
}

type LinkGroupProps = {
    group: LinkGroupType;
};

const LinkGroup = (props: LinkGroupProps) => {
    const { name, description, links } = props.group;

    return (
        <div className="space-y-3">
            <div>
                <AnchorButton name={name} />
                <p className="text-muted-foreground text-xs">{description}</p>
            </div>
            <hr />
            <ul className="space-y-2">
                {links.map((example, index) => (
                    <li key={index} className="ml-5 list-disc space-y-1 pl-1">
                        <Link
                            href={example.url}
                            className="text-md h-fit p-0 font-semibold whitespace-normal hover:underline"
                            noStyle
                        >
                            {example.title}
                        </Link>
                        <p className="text-muted-foreground text-xs">{example.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};
