# Context

When client components share state, use a context with 3 separate files in `_context/`:

```
_context/
├── context.ts          # createContext + types
├── provider.tsx        # Provider with state and logic
└── use-{domain}.ts     # Custom hook to consume the context
```

This separation preserves React fast refresh.

## Naming

- **`Context`** and **`Provider`** — generic names (scoped by the `_context/` folder, no collision risk)
- **`use{Domain}()`** — named by content (`useSessionContext`, `useCube`), because it appears in import statements of consuming components

## 1. Context — `context.ts`

Types and `createContext`. No `"use client"` needed.

```ts
import { Dispatch, SetStateAction, createContext } from "react";

type Item = {
    id: string;
    name: string;
};

export type ContextType = {
    items: Item[];
    setItems: Dispatch<SetStateAction<Item[]>>;
    selected: string | null;
    setSelected: Dispatch<SetStateAction<string | null>>;
};

export const Context = createContext<ContextType>({} as ContextType);
```

## 2. Provider — `provider.tsx`

Client component with state, logic, and the `Context.Provider` wrapper.

For SSR hydration, accept server data as props and initialize state with `useState(serverData)`.

```tsx
"use client";

import { type ReactNode, useState } from "react";
import { Context } from "./context";

type ProviderProps = {
    initialItems: Item[];
    children: ReactNode;
};

export function Provider(props: ProviderProps) {
    const { initialItems, children } = props;

    const [items, setItems] = useState(initialItems);
    const [selected, setSelected] = useState<string | null>(null);

    return <Context.Provider value={{ items, setItems, selected, setSelected }}>{children}</Context.Provider>;
}
```

## 3. Hook — `use-{domain}.ts`

Custom hook with a guard that throws if used outside the Provider.

```ts
import { useContext } from "react";
import { Context, ContextType } from "./context";

export function useItems(): ContextType {
    const context = useContext(Context);
    if (!context) throw new Error("useItems must be used within a <Provider />");
    return context;
}
```

## Usage

### Page (server) — wrap with Provider, pass server data

```tsx
export default async function Page() {
    const items = await fetchItems();

    return (
        <Provider initialItems={items}>
            <ItemList />
            <ItemDetail />
        </Provider>
    );
}
```

### Component (client) — consume with the hook

```tsx
"use client";

import { useItems } from "../_context/use-items";

export default function ItemList() {
    const { items, selected, setSelected } = useItems();
    // ...
}
```
