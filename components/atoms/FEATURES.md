# Base UI Components - Feature Tracking

Suivi de l'implémentation des composants Base UI par rapport à la documentation officielle.

- [Documentation Base UI](https://base-ui.com/react/components)

---

## Process d'import d'un composant

Étapes à suivre pour importer un nouveau composant Base UI :

### 1. Copier le code depuis la documentation

Récupérer le code d'exemple depuis la documentation Base UI.

### 2. Transformer les classes Tailwind CSS en mode V4

Utiliser les diagnostics IDE pour identifier les classes à mettre à jour :

| V3 (ancien)                        | V4 (nouveau)                    |
| ---------------------------------- | ------------------------------- |
| `data-[highlighted]:*`             | `data-highlighted:*`            |
| `data-[popup-open]:*`              | `data-popup-open:*`             |
| `data-[ending-style]:*`            | `data-ending-style:*`           |
| `data-[starting-style]:*`          | `data-starting-style:*`         |
| `origin-[var(--transform-origin)]` | `origin-(--transform-origin)`   |
| `outline outline-1`                | `outline-1` (supprimer doublon) |

### 3. Trier les classes CSS avec commentaires et cn()

Organiser les classes par catégorie :

```tsx
className={cn(
    // Layout
    "flex items-center gap-2 py-2 px-4",
    "data-highlighted:relative data-highlighted:z-0",
    // Border
    "rounded-md outline-none",
    // Background
    "bg-white hover:bg-gray-100",
    // Text
    "text-sm text-gray-900 select-none",
    // Shadow
    "shadow-lg shadow-gray-200 dark:shadow-none",
    // Animation
    "transition-[transform,scale,opacity]",
    "data-ending-style:scale-90 data-ending-style:opacity-0",
)}
```

### 4. Remplacer bg-[canvas] par bg-white

Les system colors CSS (`canvas`, `canvastext`, etc.) ne fonctionnent pas avec le dark mode basé sur les classes `.dark`. Utiliser les variables du projet à la place.

### 5. Créer un exemple de données par défaut

Créer un `exampleItems` qui exploite un maximum de fonctionnalités du composant pour servir d'exemple et de test.

### 6. Mettre à jour ce fichier

Ajouter le tableau de features du nouveau composant.

---

## Pattern dual : items / children

Les composants atomiques supportent deux modes d'utilisation :

### Mode déclaratif (items)

Utilisation simple avec un tableau d'items en props :

```tsx
import Menu from "@comps/atoms/menu/menu";

// Utilisation avec items par défaut ou custom
<Menu items={myItems} label="Actions" />;
```

### Mode compositionnel (children)

Contrôle total avec les atomes exportés :

```tsx
import { Button, Popup, Portal, Positioner, Trigger } from "@comps/atoms/menu/atoms";
import Menu from "@comps/atoms/menu/menu";

<Menu>
    <Trigger className="px-2">
        <CustomIcon />
    </Trigger>
    <Portal>
        <Positioner>
            <Popup>
                <Button value="action1" onItemClick={handleAction1}>
                    <Icon /> Action 1
                </Button>
                <Button value="action2" onItemClick={handleAction2}>
                    <Icon /> Action 2
                </Button>
            </Popup>
        </Positioner>
    </Portal>
</Menu>;
```

### Quand utiliser quel mode ?

| Mode               | Cas d'usage                                       |
| ------------------ | ------------------------------------------------- |
| **Déclaratif**     | Menus simples, données statiques, structure fixe  |
| **Compositionnel** | Logique custom, icônes dynamiques, hooks internes |

Exemples :

- `components/molecule/menu-theme.tsx` - Mode compositionnel (useTheme + icônes dynamiques)
- `components/molecule/menu-profile.tsx` - Mode compositionnel (useSession + navigation)
- `app/test/page.tsx` - Mode déclaratif (items par défaut)

---

## Select (~80%)

Basé sur : https://base-ui.com/react/components/select

| Feature                         | Implémenté | Doc | Notes                                      |
| ------------------------------- | :--------: | :-: | ------------------------------------------ |
| **Sous-composants de base**     |
| Root, Trigger, Value, Icon      |     ✅     | ✅  |                                            |
| Portal, Positioner, Popup, List |     ✅     | ✅  |                                            |
| Item, ItemText, ItemIndicator   |     ✅     | ✅  |                                            |
| Group, GroupLabel               |     ✅     | ✅  |                                            |
| Separator                       |     ✅     | ✅  |                                            |
| ScrollUpArrow, ScrollDownArrow  |     ✅     | ✅  |                                            |
| Arrow (flèche popup)            |     ❌     | ✅  | Flèche positionnée vers le trigger         |
| Backdrop (overlay)              |     ❌     | ✅  | Fond semi-transparent                      |
| **Props Root**                  |
| value (controlled)              |     ✅     | ✅  | `selected` prop                            |
| onValueChange                   |     ✅     | ✅  | `onSelect` prop                            |
| multiple                        |     ✅     | ✅  |                                            |
| defaultValue (uncontrolled)     |     ❌     | ✅  | Mode non-contrôlé                          |
| open / onOpenChange             |     ❌     | ✅  | Contrôle ouverture popup                   |
| defaultOpen                     |     ❌     | ✅  | État initial popup                         |
| disabled                        |     ❌     | ✅  | Désactiver le select                       |
| modal                           |     ❌     | ✅  | Verrouille la page (défaut: true)          |
| highlightItemOnHover            |     ❌     | ✅  | Surbrillance au survol                     |
| isItemEqualToValue              |     ❌     | ✅  | Comparaison custom                         |
| itemToStringLabel               |     ❌     | ✅  | Objets → label                             |
| **Props Positioner**            |
| sideOffset                      |     ✅     | ✅  |                                            |
| alignItemWithTrigger            |     ✅     | ✅  |                                            |
| side (top/bottom/left/right)    |     ✅     | ✅  | Props exposées                             |
| align (start/center/end)        |     ✅     | ✅  | Props exposées                             |
| collisionAvoidance              |     ❌     | ✅  | Gestion collisions                         |
| collisionBoundary               |     ❌     | ✅  | Zone de confinement                        |
| **Props Item**                  |
| disabled (par item)             |     ❌     | ✅  | Désactiver items individuels               |
| **Features custom**             |
| Value render function           |     ✅     | ❌  | `(value) => ReactNode`                     |
| items lookup object             |     ✅     | ❌  | `{ [key: string]: string \| null }`        |
| renderValue utility             |     ✅     | ❌  | Formatage multi-mode dans `utils.tsx`      |
| formattingFn modes              |     ✅     | ❌  | joinedByComma, selectedCounter, firstItem+ |
| customDisplayLabelArray         |     ✅     | ❌  | Fonction de rendu personnalisée            |
| placeholder item                |     ✅     | ❌  | Item placeholder dans la liste             |

---

## Menu (~80%)

Basé sur : https://base-ui.com/react/components/menu

| Feature                     | Implémenté | Doc | Notes                            |
| --------------------------- | :--------: | :-: | -------------------------------- |
| **Sous-composants de base** |
| Root, Trigger, Portal       |     ✅     | ✅  |                                  |
| Positioner, Popup           |     ✅     | ✅  |                                  |
| Item                        |     ✅     | ✅  | Basique (label + onClick)        |
| Arrow                       |     ✅     | ✅  |                                  |
| Separator                   |     ✅     | ✅  |                                  |
| Group, GroupLabel           |     ✅     | ✅  |                                  |
| Backdrop                    |     ❌     | ✅  | Overlay                          |
| **Items avancés**           |
| CheckboxItem                |     ✅     | ✅  |                                  |
| CheckboxItemIndicator       |     ✅     | ✅  |                                  |
| RadioGroup                  |     ✅     | ✅  |                                  |
| RadioItem                   |     ✅     | ✅  |                                  |
| RadioItemIndicator          |     ✅     | ✅  |                                  |
| **Submenus**                |
| SubmenuRoot                 |     ✅     | ✅  |                                  |
| SubmenuTrigger              |     ✅     | ✅  |                                  |
| **Props Root**              |
| open / onOpenChange         |     ❌     | ✅  | Mode contrôlé                    |
| modal                       |     ❌     | ✅  | Mode modal                       |
| loopFocus                   |     ❌     | ✅  | Boucle clavier                   |
| openOnHover                 |     ✅     | ✅  |                                  |
| delay                       |     ❌     | ✅  | Délai hover (100ms)              |
| **Props Positioner**        |
| sideOffset                  |     ✅     | ✅  |                                  |
| side                        |     ❌     | ✅  | Position (top/bottom/left/right) |
| align                       |     ❌     | ✅  | Alignement                       |
| collisionAvoidance          |     ❌     | ✅  | Gestion collisions               |
| **Props Item**              |
| disabled                    |     ❌     | ✅  | Désactiver items                 |
| **Features avancées**       |
| Navigation links            |     ❌     | ✅  | Items comme liens                |
| Dialog integration          |     ❌     | ✅  | Ouvrir dialog depuis menu        |
| Detached triggers           |     ❌     | ✅  | `createHandle()`                 |
| Multiple triggers           |     ❌     | ✅  | Plusieurs déclencheurs           |

---

## Field (~30%)

Basé sur : https://base-ui.com/react/components/field

| Feature              | Implémenté | Doc | Notes                         |
| -------------------- | :--------: | :-: | ----------------------------- |
| **Sous-composants**  |
| Root                 |     ✅     | ✅  |                               |
| Label                |     ✅     | ✅  |                               |
| Control              |     ✅     | ✅  | Input par défaut              |
| Error                |     ✅     | ✅  |                               |
| Description          |     ✅     | ✅  |                               |
| Validity             |     ❌     | ✅  | Affiche état de validité      |
| **Props Root**       |
| validationMode       |     ✅     | ✅  | `onChange`                    |
| disabled             |     ❌     | ✅  | Désactiver le champ           |
| invalid              |     ❌     | ✅  | État invalide forcé           |
| validate             |     ❌     | ✅  | Fonction de validation custom |
| validateDebounceTime |     ❌     | ✅  | Délai de validation           |
| validateOnChange     |     ❌     | ✅  | Validation au changement      |
| **Intégrations**     |
| Avec Select          |     ❌     | ✅  | Wrapper accessibility         |
| Avec autres inputs   |     ❌     | ✅  | Checkbox, Radio, etc.         |
