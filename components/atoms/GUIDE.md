# Guide : Création d'un composant Base UI

Exemple de référence : `alert-dialog/`

## Structure finale

```
components/atoms/[composant]/
├── [composant].tsx    # Composant principal avec conditional children
├── atoms.tsx          # Wrappers Base UI avec styles
└── index.ts           # Exports
```

---

## Étape 1 : Copier l'exemple Base UI

1. Aller sur https://base-ui.com/react/components/[composant]
2. Copier le code de l'exemple Tailwind (`#hero:tailwind:index.tsx`)
3. Créer le fichier `[composant].tsx` et coller le code

```tsx
// alert-dialog.tsx (copié-collé brut)
import { AlertDialog } from "@base-ui/react/alert-dialog";

export default function ExampleAlertDialog() {
    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger className="...">Discard draft</AlertDialog.Trigger>
            ...
        </AlertDialog.Root>
    );
}
```

---

## Étape 2 : Stager les changes

```bash
git add .
```

Permet de contrôler les différences à chaque modification.

---

## Étape 3 : Préparer le pattern conditional children

Modifier `[composant].tsx` pour :

- Ajouter `"use client"` en haut (dans les deux fichiers : `[composant].tsx` et `atoms.tsx`)
- Importer les atoms (qu'on va créer après)
- Ajouter le pattern `if (children)` pour la composition

```tsx
// alert-dialog.tsx
"use client";

import { AlertDialogProps, Backdrop, Close, Description, Popup, Portal, Root, Title, Trigger } from "./atoms";

export default function AlertDialog(props: AlertDialogProps) {
    const { children, ...otherProps } = props;

    // Mode composable : retourne juste le Root avec les children
    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    // Mode démo : affiche l'exemple complet
    return (
        <Root {...otherProps}>
            <Trigger>Discard draft</Trigger>
            <Portal>
                <Backdrop />
                <Popup>
                    <Title>Discard draft?</Title>
                    <Description>You can&apos;t undo this action.</Description>
                    <div className="flex justify-end gap-4">
                        <Close>Cancel</Close>
                        <Close className="text-destructive">Discard</Close>
                    </div>
                </Popup>
            </Portal>
        </Root>
    );
}
```

---

## Étape 4 : Créer les atoms

Créer `atoms.tsx` avec les wrappers Base UI :

### 4.1 Structure de base

```tsx
// atoms.tsx
import { AlertDialog as AlertDialogBaseUi } from "@base-ui/react/alert-dialog";
import cn from "@lib/cn";
import { ComponentProps, ReactNode } from "react";

// Export du type pour le composant principal
export type AlertDialogProps = { children?: ReactNode } & ComponentProps<typeof AlertDialogBaseUi.Root>;
```

### 4.2 Wrapper chaque sous-composant

Pour chaque sous-composant Base UI :

```tsx
export const Root = (props: AlertDialogProps) => {
    const { children, ...otherProps } = props;
    return <AlertDialogBaseUi.Root {...otherProps}>{children}</AlertDialogBaseUi.Root>;
};

export const Trigger = (
    props: { className?: string; children?: ReactNode } & ComponentProps<typeof AlertDialogBaseUi.Trigger>,
) => {
    const { className, children, ...otherProps } = props;

    return (
        <AlertDialogBaseUi.Trigger
            className={cn(
                // Layout
                "flex h-10 items-center justify-center px-3.5",
                // Border
                "rounded-md border border-gray-200",
                // Background
                "bg-background",
                // Text
                "text-destructive text-base font-medium select-none",
                // State
                "focus-visible:outline-outline hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 active:bg-gray-100",
                // Overrides
                className,
            )}
            {...otherProps}
        >
            {children}
        </AlertDialogBaseUi.Trigger>
    );
};
```

### 4.3 Organisation des classes cn()

Trier les classes par catégorie avec commentaires :

```tsx
className={cn(
    // Layout      - position, display, flex, size, spacing
    // Border      - rounded, border, outline
    // Background  - bg-*
    // Text        - text-*, font-*
    // Shadow      - shadow-*
    // Animation   - transition, duration, data-*-style
    // State       - hover, active, focus-visible, disabled
    // Overrides   - className (toujours en dernier)
)}
```

### 4.4 Remplacer par les variables du thème

| Classe Base UI     | Variable thème     |
| ------------------ | ------------------ |
| `bg-gray-50`       | `bg-background`    |
| `text-gray-900`    | `text-foreground`  |
| `text-red-800`     | `text-destructive` |
| `outline-blue-800` | `outline-outline`  |

Les classes `gray-*` sont déjà adaptatives (voir `globals.css`).

**Exceptions :**

- `bg-black` pour les overlays (Backdrop) - reste noir
- `dark:opacity-70` pour ajuster l'opacité en dark mode
- `dark:outline-gray-300` si la bordure doit changer en dark mode

### 4.5 Migrer vers Tailwind v4

| Tailwind v3                                     | Tailwind v4                    |
| ----------------------------------------------- | ------------------------------ |
| `data-[ending-style]:opacity-0`                 | `data-ending-style:opacity-0`  |
| `data-[starting-style]:scale-90`                | `data-starting-style:scale-90` |
| `outline outline-1`                             | `outline-1`                    |
| `focus-visible:outline focus-visible:outline-2` | `focus-visible:outline-2`      |

---

## Étape 5 : Créer index.ts

```tsx
// index.ts
export { default } from "./alert-dialog";
export * from "./atoms";
```

---

## Étape 6 : Vérifier

```bash
pnpm type
```

---

## Usage

### Mode composable (recommandé)

```tsx
import AlertDialog, { Backdrop, Close, Description, Popup, Portal, Title } from "@comps/atoms/alert-dialog";

<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
    <Portal>
        <Backdrop />
        <Popup>
            <Title>Mon titre</Title>
            <Description>Ma description</Description>
            <div className="flex justify-end gap-4">
                <Close>Annuler</Close>
                <Close className="text-destructive">Confirmer</Close>
            </div>
        </Popup>
    </Portal>
</AlertDialog>;
```

### Mode démo (sans children)

```tsx
import AlertDialog from "@comps/atoms/alert-dialog";

<AlertDialog />; // Affiche l'exemple complet
```
