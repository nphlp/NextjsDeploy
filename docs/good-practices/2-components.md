# Components

## Single Component Per File

Each file contains a single component.

## Props Structure

- Type is defined above the component
- Type is used in the component signature
- Props are destructured on the first line of the component

```tsx
type MyComponentProps = {
    title: string;
    count: number;
};

export default function MyComponent(props: MyComponentProps) {
    const { title, count } = props;

    return (
        <div>
            {title}: {count}
        </div>
    );
}
```

## JSX — Avoid Complex Conditions

Avoid complex conditions in JSX. Prefer assigning a constant in JS, then use it in JSX.

```tsx
// Bad
{
    session?.user.role === "ADMIN" && <Button />;
}

// Good
const isAdmin = session?.user.role === "ADMIN";

return <div>{isAdmin && <Button />}</div>;
```
