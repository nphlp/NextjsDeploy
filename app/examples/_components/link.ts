import { Route } from "next";

type LinkType = {
    url: Route;
    title: string;
    description: string;
};

type LinkGroupType = {
    name: string;
    description: string;
    links: LinkType[];
};

const exampleLinks: LinkGroupType[] = [
    {
        name: "Server Side Rendering",
        description: "SSR patterns with oRPC, useState, useFetch and useQuery.",
        links: [
            {
                url: "/examples/ssr/use-state",
                title: "SSR + useState + Toggle",
                description: "",
            },
            {
                url: "/examples/ssr/use-fetch",
                title: "SSR + useState + useFetch + Toggle",
                description: "",
            },
            {
                url: "/examples/ssr/use-query",
                title: "SearchParams SSR + useFetch + useQuery + Toggle",
                description: "",
            },
            {
                url: "/examples/ssr/zustand-cookie",
                title: "SSR + Zustand + Cookie Persistence",
                description: "State persistence with Zustand and cookies, maintained across refreshes",
            },
        ],
    },
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
                url: "/examples/layout/reactive-container-height",
                title: "Reactive container height",
                description: "A container that adjusts its height reactively based on its content.",
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

export default exampleLinks;
export type { LinkType, LinkGroupType };
