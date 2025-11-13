import Link from "@comps/SHADCN/components/link";
import { Card, CardContent, CardHeader } from "@comps/SHADCN/ui/card";
import { Route } from "next";

type LinkType = {
    url: Route;
    title: string;
    description: string;

    // Enabled conditions
    // developmentOnly?: boolean;
    // sessionRequired?: boolean;
    // adminOnly?: boolean;
};

type LinkGroupType = {
    name: string;
    description: string;
    links: LinkType[];
};

const exampleLinks: LinkGroupType[] = [
    {
        name: "Layout & UI Patterns",
        description: "Classical layout and UI patterns.",
        links: [
            {
                url: "/examples/layout/auto-center-or-start",
                title: "Auto center or start content",
                description: "A layout that automatically centers or starts its content based on the available space.",
            },
            {
                url: "/examples/layout/suspense-skeletons-loaders-empty-states",
                title: "Suspense, skeletons, loaders, empty states",
                description:
                    "Examples demonstrating the use of Suspense, skeleton screens, loaders, and handling empty states in a Next.js application.",
            },
            {
                url: "/examples/layout/dashboard-with-sidebar",
                title: "Dashboard with sidebar",
                description: "A dashboard layout featuring a collapsible sidebar for navigation.",
            },
        ],
    },
    {
        name: "Cache Components",
        description: 'Caching mecanisms with "use cache", "use cache: remote" and "use cache: private".',
        links: [
            {
                url: "/examples/cache-component/basics",
                title: "Cache Component Basics",
                description: "Documentation and short examples",
            },
            {
                url: "/examples/cache-component/use-cache",
                title: '"use cache" directive',
                description: "",
            },
            {
                url: "/examples/cache-component/use-cache-remote",
                title: '"use cache: remote" directive',
                description: "",
            },
            {
                url: "/examples/cache-component/use-cache-private",
                title: '"use cache: private" directive',
                description: "",
            },
        ],
    },
    {
        name: "Server Side Rendering ",
        description: "SSR patterns with oRPC, useState, useFetch and useQuery.",
        links: [
            {
                url: "/examples/ssr/use-state",
                title: "SSR (take 10) + useState + Toggle (show 3 or 10 items)",
                description: "-> Fecth 10 server\n-> Hydrate useState\n-> ⛔︎ Perd le state au refresh",
            },
            {
                url: "/examples/ssr/use-fetch",
                title: "SSR (take 3) + useFetch + Toggle (take 3 or 10 items)",
                description:
                    "-> Fetch 3 server, puis foetch 10 client\n-> Hydrate useFetch initialData\n-> ⛔︎ Perd le state au refresh",
            },
            {
                url: "/examples/ssr/use-query",
                title: "SearchParams SSR (take 3 or 10) + useFetch + useQuery (take 3 or 10 items)",
                description:
                    "-> Parse SearchParams côté server\n-> Fetch 3 ou 10 server, puis fetch 3 ou 10 client\n-> Hydrate useFetch initialData\n-> ✔︎ Garde le state au refresh",
            },
        ],
    },
    {
        name: "UseQuery Examples",
        description: "Various useQuery patterns and implementations.",
        links: [
            {
                url: "/examples/use-query/seul",
                title: "useQuery seul",
                description: "Using useQuery independently",
            },
            {
                url: "/examples/use-query/server",
                title: "useQuery server",
                description: "Using useQuery with server-side data",
            },
            {
                url: "/examples/use-query/centralise",
                title: "useQuery centralisé",
                description: "Using centralized useQuery",
            },
        ],
    },
    {
        name: "Optimistic Mutations",
        description: "Optimistic UI updates for single, array, and hybrid operations.",
        links: [
            {
                url: "/examples/optimistic-mutations/single",
                title: "Single (Add, Update, Delete)",
                description: "Optimistic mutations for single items",
            },
            {
                url: "/examples/optimistic-mutations/array",
                title: "Array (Add, Update, Delete)",
                description: "Optimistic mutations for arrays",
            },
            {
                url: "/examples/optimistic-mutations/hybrid",
                title: "Hybrid (Add, Update, Delete)",
                description: "Optimistic mutations with hybrid approach",
            },
        ],
    },
    {
        name: "Context",
        description: "React Context patterns with server and client components.",
        links: [
            {
                url: "/examples/context/basic",
                title: "Basic Context",
                description: "Server page, context provider, and multiple server components",
            },
            {
                url: "/examples/context/advanced",
                title: "Advanced Context",
                description: "Advanced context with enhanced features",
            },
        ],
    },
];

export default function Page() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Examples</h2>
                <p>A collection of examples demonstrating various features for this Next.js template.</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
                {exampleLinks.map((group, index) => (
                    <LinkGroup key={index} group={group} />
                ))}
            </div>
        </div>
    );
}

type LinkGroupProps = {
    group: LinkGroupType;
};

const LinkGroup = (props: LinkGroupProps) => {
    const { name, description, links } = props.group;

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <h3 className="text-lg font-semibold">{name}</h3>
                <p className="text-muted-foreground text-xs">{description}</p>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {links.map((example, index) => (
                        <li key={index} className="ml-5 list-disc space-y-1 pl-1">
                            <Link
                                href={example.url}
                                variant="link"
                                className="text-md h-fit p-0 font-semibold whitespace-normal"
                            >
                                {example.title}
                            </Link>
                            <p className="text-muted-foreground text-xs">{example.description}</p>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};
