# Context

When Client Components share state, use a context with 3 separate files:

- `context.ts` — contains `createContext` and types
- `provider.tsx` — contains the provider with logic (hooks, state, callbacks)
- `use-{context-name}.ts` — contains the custom hook to consume the context

This separation preserves React fast refresh.
