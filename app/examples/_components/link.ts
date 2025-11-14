import { Route } from "next";

type LinkType = {
    url: Route;
    title: string;
    shortTitle: string;
    description: string;
};

type LinkGroupType = {
    name: string;
    description: string;
    longDescription: string;
    links: LinkType[];
};

const exampleLinks: LinkGroupType[] = [
    {
        name: "Server Side Rendering",
        description: "SSR patterns with oRPC, useState, useFetch and useQuery.",
        longDescription:
            "Explore different patterns for server-side rendering in Next.js, from basic useState hydration to advanced URL-based state persistence with cookies. Learn how to combine SSR with client-side hooks like useFetch and useQuery for optimal performance and user experience.",
        links: [
            {
                url: "/examples/ssr/use-state",
                title: "SSR + useState + Toggle",
                shortTitle: "SSR useState",
                description: "Server-side fetch with client-side useState toggle, static data without refetching",
            },
            {
                url: "/examples/ssr/use-fetch",
                title: "SSR + useState + useFetch + Toggle",
                shortTitle: "SSR useFetch",
                description: "SSR with reactive client-side useFetch hook for dynamic data refetching",
            },
            {
                url: "/examples/ssr/use-query",
                title: "SearchParams SSR + useFetch + useQuery + Toggle",
                shortTitle: "SSR useQuery",
                description: "URL-based state persistence with SSR, useFetch and useQueryStates for shareable URLs",
            },
            {
                url: "/examples/ssr/zustand-cookie",
                title: "SSR + Zustand + Cookie Persistence",
                shortTitle: "SSR Zustand",
                description: "State persistence with Zustand and cookies, maintained across refreshes",
            },
        ],
    },
    {
        name: "Layout & UI Patterns",
        description: "Classical layout and UI patterns.",
        longDescription:
            "Classic and modern layout patterns including auto-centering, reactive containers, dashboard layouts with sidebars, and proper handling of loading states with Suspense, skeletons, and empty state components.",
        links: [
            {
                url: "/examples/layout/auto-center-or-start",
                title: "Auto center or start content",
                shortTitle: "Auto center/start",
                description: "A layout that automatically centers or starts its content based on the available space.",
            },
            {
                url: "/examples/layout/reactive-container-height",
                title: "Reactive container height",
                shortTitle: "Reactive height",
                description: "A container that adjusts its height reactively based on its content.",
            },
            {
                url: "/examples/layout/suspense-skeletons-loaders-empty-states",
                title: "Suspense, skeletons, loaders, empty states",
                shortTitle: "Skeletons & empty",
                description:
                    "Examples demonstrating the use of Suspense, skeleton screens, loaders, and handling empty states in a Next.js application.",
            },
            {
                url: "/examples/layout/dashboard-with-sidebar",
                title: "Dashboard with sidebar",
                shortTitle: "Dashboard sidebar",
                description: "A dashboard layout featuring a collapsible sidebar for navigation.",
            },
            {
                url: "/examples/layout/drag-and-drop",
                title: "Drag and Drop",
                shortTitle: "Drag and Drop",
                description: "Implementing drag-and-drop functionality within a Next.js application.",
            },
        ],
    },
    {
        name: "Cache Components",
        description: 'Caching mecanisms with "use cache", "use cache: remote" and "use cache: private".',
        longDescription:
            'Master Next.js 15 caching directives including "use cache" for shared public data, "use cache: remote" for CDN distribution, and "use cache: private" for user-specific content. Understand when and how to use each caching strategy.',
        links: [
            {
                url: "/examples/cache-component/basics",
                title: "Cache Component Basics",
                shortTitle: "Cache Basics",
                description: "Documentation and short examples",
            },
            {
                url: "/examples/cache-component/use-cache",
                title: "use cache directive",
                shortTitle: "use cache",
                description: "Shared cache for all users, ideal for public data and static content",
            },
            {
                url: "/examples/cache-component/use-cache-remote",
                title: "use cache: remote directive",
                shortTitle: "use cache: remote",
                description: "Remote CDN cache for distributed caching across multiple servers",
            },
            {
                url: "/examples/cache-component/use-cache-private",
                title: "use cache: private directive",
                shortTitle: "use cache: private",
                description: "User-specific cache for personalized content and authenticated data",
            },
        ],
    },
    {
        name: "UseQuery Examples",
        description: "Various useQuery patterns and implementations.",
        longDescription:
            "Learn different approaches to data fetching with useQuery: client-only patterns, server-side hydration, and centralized query management for consistent data access across your application.",
        links: [
            {
                url: "/examples/use-query/client",
                title: "useQuery client",
                shortTitle: "useQuery client",
                description: "Using useQuery independently",
            },
            {
                url: "/examples/use-query/server",
                title: "useQuery server",
                shortTitle: "useQuery server",
                description: "Using useQuery with server-side data",
            },
            {
                url: "/examples/use-query/centralise",
                title: "useQuery centralisé",
                shortTitle: "useQuery centralisé",
                description: "Using centralized useQuery",
            },
        ],
    },
    {
        name: "Optimistic Mutations",
        description: "Optimistic UI updates for single, array, and hybrid operations.",
        longDescription:
            "Implement optimistic UI updates for better user experience. Covers single item mutations, array operations, and hybrid approaches combining both patterns for complex state management scenarios.",
        links: [
            {
                url: "/examples/optimistic-mutations/single",
                title: "Single (Add, Update, Delete)",
                shortTitle: "Single state",
                description: "Optimistic mutations for single items",
            },
            {
                url: "/examples/optimistic-mutations/array",
                title: "Array (Add, Update, Delete)",
                shortTitle: "Array of states",
                description: "Optimistic mutations for arrays",
            },
            {
                url: "/examples/optimistic-mutations/hybrid",
                title: "Hybrid (Add, Update, Delete)",
                shortTitle: "Mixed states",
                description: "Optimistic mutations with hybrid approach",
            },
        ],
    },
    {
        name: "Context",
        description: "React Context patterns with server and client components.",
        longDescription:
            "React Context patterns tailored for Next.js with examples showing how to properly use context with server and client components, provider setup, and advanced context features for shared state management.",
        links: [
            {
                url: "/examples/context/basic",
                title: "Basic Context",
                shortTitle: "Basic Context",
                description: "Server page, context provider, and multiple server components",
            },
            {
                url: "/examples/context/advanced",
                title: "Advanced Context",
                shortTitle: "Advanced Context",
                description: "Advanced context with enhanced features",
            },
        ],
    },
];

export default exampleLinks;
export type { LinkType, LinkGroupType };
