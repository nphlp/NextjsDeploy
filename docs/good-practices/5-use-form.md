# useForm — Submission Pattern

Reference implementation: `app/dev/form/_components/form-example.tsx`

## Standard Pattern

```tsx
const handleSubmit: OnSubmit = async (event) => {
    event.preventDefault();

    // Validation
    const values = submit();

    // Cancel if validation fails
    if (!values) return;

    // Set loader after validation
    setIsLoading(true);

    try {
        // Async submission
        const result = await asyncCall(values);

        // Toast success
        toast.add({ title: "Success", description: "...", type: "success" });

        // Reset form
        reset();
    } catch {
        // Toast error
        toast.add({ title: "Erreur", description: "Une erreur est survenue.", type: "error" });
    }

    // Stop loader
    setIsLoading(false);
};
```

## With Redirect

Next.js SPA does not unmount components on `router.push()`. Wrap `reset()` in `setTimeout` so the user does not see the fields clearing before the navigation.

```tsx
try {
    // Async submission
    const result = await asyncCall(values);

    // Toast success
    toast.add({ title: "Success", description: "...", type: "success" });

    // Redirect
    router.push("/destination");

    // Reset form (delayed to avoid visible field clearing)
    setTimeout(() => reset(), 1000);
} catch {
    // Toast error
    toast.add({ title: "Erreur", description: "Une erreur est survenue.", type: "error" });
}
```

## Rules

1. **`setIsLoading(false)` outside try-catch** — always reached, no loading stuck state
2. **No `return` inside try** — ensures `setIsLoading(false)` is reached
3. **`reset()` in `setTimeout` only with redirect** — direct call otherwise
4. **Catch block = generic error** — network failures, unexpected exceptions
5. **Try block = business logic** — API-specific error handling with `if/else`

## Exception: Fire-and-Forget

Some forms intentionally skip error handling for security reasons (e.g., anti-enumeration on password reset requests). These don't need try-catch.
