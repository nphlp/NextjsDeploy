import Link from "@comps/SHADCN/components/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@comps/SHADCN/ui/card";
import { Route } from "next";

type ExampleLink = {
    url: Route;
    title: string;
    description: string;
};

const orpcSsrExamples: ExampleLink[] = [
    {
        url: "/examples/orpc/ssr-1",
        title: "SSR with client-side filtering",
        description: "Fetch initial data server-side and re-fetch client-side when user selection changes.",
    },
    {
        url: "/examples/orpc/ssr-2",
        title: "SearchParams filtering",
        description: "Fetch initial data server-side and re-fetch client-side when user filter table values.",
    },
];

const solidSsrExamples: ExampleLink[] = [
    // {
    //     url: "/examples/solid/ssr-1",
    //     title: "SSR with client-side filtering",
    //     description: "Fetch initial data server-side and re-fetch client-side when user selection changes.",
    // },
    {
        url: "/examples/solid/ssr-2",
        title: "SearchParams filtering",
        description: "Fetch initial data server-side and re-fetch client-side when user filter table values.",
    },
];

// const layoutExamples: ExampleLink[] = [
//     {
//         url: "/examples/layout-1",
//         title: "Layout auto-centering",
//         description: "Center content or start-aligned based on layout configuration.",
//     },
//     {
//         url: "/examples/layout-2",
//         title: "Layout with sidebar",
//         description: "Use a sidebar navigation with Shadcn components.",
//     },
// ];

export default function Page() {
    return (
        <div>
            <Card className="w-[500px]">
                <CardHeader className="text-center">
                    <CardTitle>
                        <h2 className="text-2xl font-bold">Examples</h2>
                    </CardTitle>
                    <CardDescription>
                        A collection of examples demonstrating various features for this Next.js template.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <LinkSection
                        title="oRPC SSR"
                        description="Fetching initial data server-side and hydrating useState(s) on the client-side."
                        links={orpcSsrExamples}
                    />
                    <LinkSection
                        title="Solid SSR"
                        description="Fetching initial data server-side and hydrating useState(s) on the client-side."
                        links={solidSsrExamples}
                    />
                    {/* <LinkSection
                        title="Layout Configurations"
                        description="Examples of layout CSS or Shadcn configurations."
                        links={layoutExamples}
                    /> */}
                </CardContent>
            </Card>
        </div>
    );
}

type LinkSectionProps = {
    title: string;
    description: string;
    links: ExampleLink[];
};

const LinkSection = (props: LinkSectionProps) => {
    const { title, description, links } = props;

    return (
        <div className="space-y-3">
            <div className="space-y-1">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-muted-foreground text-xs">{description}</p>
            </div>
            <hr className="mx-1" />
            <ul className="space-y-3">
                {links.map((example, index) => (
                    <li key={index} className="ml-5 list-disc space-y-1 pl-1">
                        <Link href={example.url} variant="link" className="text-md h-fit p-0 font-semibold">
                            {example.title}
                        </Link>
                        <p className="text-muted-foreground text-xs">{example.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};
