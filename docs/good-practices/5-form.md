# Forms

Reference implementation: `app/dev/form/_components/form-example.tsx`

## Architecture

```
components/atoms/form/
├── use-form.ts         # useForm hook — state, validation, register
├── form.tsx            # <Form> wrapper — <form> + FormProvider
├── field.tsx           # <Field> — label + children + error indication
├── schemas.ts          # Centralized Zod schemas
└── _context/           # FormProvider context (register function)
```

The form system connects through context: `<Form>` passes the `register` function via `FormProvider` → `<Field>` and `<Input useForm>` consume it via `useFormContext()`.

## useForm Hook

### Config

Each field is defined with:

```ts
const { register, states, setStates, submit, reset } = useForm({
    email: {
        schema: emailSchema, // Submit validation (strict)
        onChangeSchema: emailSchemaProgressive, // While typing (lenient)
        onBlurSchema: z.string(), // On field leave
        setter: (value: string) => value, // Transform before storing
        defaultValue: "", // Initial value
    },
});
```

| Property         | Required | Purpose                                                                |
| ---------------- | -------- | ---------------------------------------------------------------------- |
| `schema`         | Yes      | Submit validation. Also used for onChange/onBlur if no override        |
| `onChangeSchema` | No       | Progressive validation while typing (e.g. email without full TLD)      |
| `onBlurSchema`   | No       | Validation when user leaves the field                                  |
| `setter`         | Yes      | Transform function before storing (`(value) => value` for passthrough) |
| `defaultValue`   | Yes      | Initial value (`""`, `null`, `[]`, etc.)                               |

### Progressive Validation

The problem: an email field validated with `emailSchema` shows errors while the user is still typing (`"john"` → invalid). The field appears red before the user has finished — frustrating UX.

The solution: `onChangeSchema` and `onBlurSchema` provide progressive validation levels.

```
onChange → onChangeSchema ?? schema    (while typing)
onBlur  → onBlurSchema   ?? schema    (when leaving the field)
submit  → schema                      (always strict)
```

**`schema`** — strict validation, used on submit. An email must be fully valid (`john@example.com`).

**`onChangeSchema`** — lenient validation while typing. Accepts partial progress: `"john"` → `"john@"` → `"john@ex"` → `"john@example.com"`. The user only sees an error if they type something truly invalid (e.g. `"..john"`), not because they haven't finished.

**`onBlurSchema`** — validation when the user leaves the field. Can be `z.string()` (accepts anything) to avoid showing errors when the user just clicked in and out without typing. Or omit it to fall back to `schema` for strict blur validation.

**Example — form-example.tsx vs login-form.tsx:**

```ts
// form-example.tsx — strict on blur (no onBlurSchema → falls back to schema)
email: {
    schema: emailSchema,
    onChangeSchema: emailSchemaProgressive,
    setter: (value: string) => value,
    defaultValue: "",
},

// login-form.tsx — lenient on blur (onBlurSchema: z.string() → no error on click-out)
email: {
    schema: emailSchema,
    onChangeSchema: emailSchemaProgressive,
    onBlurSchema: z.string(),
    setter: (value: string) => value,
    defaultValue: "",
},
```

In the form example, leaving the email field empty shows an error (strict). In the login form, it doesn't (lenient) — better UX for a login where the user might tab through fields.

### Return Values

| Value       | Type                                                                        | Purpose                                                                        |
| ----------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `register`  | `(fieldName) => { name, value, status, errors, onFocus, onChange, onBlur }` | Bind a field — passed to `<Form>`, consumed by `<Field>` and `<Input useForm>` |
| `states`    | `{ [fieldName]: value }`                                                    | Current values for all fields (read-only access)                               |
| `setStates` | `{ [fieldName]: (value) => void }`                                          | Set a field value programmatically                                             |
| `submit`    | `() => validatedData \| undefined`                                          | Validate all fields, return typed data or `undefined` on failure               |
| `reset`     | `() => void`                                                                | Reset all fields to `defaultValue`                                             |

## Components

### `<Form>` — form wrapper

Wraps `<form>` and provides the `register` function to children via context.

```tsx
<Form register={register} onSubmit={handleSubmit} className="gap-4">
    {children}
</Form>
```

### `<Field>` — label + input + indication

Coordinates label, children (input), and validation feedback. Shows description OR error based on field status.

Uses `data-invalid` and `data-disabled` attributes on the wrapper div for child styling.

```tsx
<Field name="email" label="Email" description="Enter your email" disabled={isLoading} required>
    <Input name="email" placeholder="john@example.com" useForm />
</Field>
```

### `<Input useForm>` — form-aware input

When `useForm={true}`, the input reads value and triggers validation through the form context. The `name` prop must match the field name in `useForm()` config.

```tsx
// With form context (inside <Form> + <Field>)
<Input name="email" useForm />

// Without form context (standalone, local state)
<Input value={value} onChange={handleChange} />
```

### Tailwind `group-data-*/field:` Classes

`<Field>` sets `data-invalid` and `data-disabled` on its wrapper div with `group/field`. Input atoms use these for conditional styling:

```tsx
className={cn(
    "rounded-md border border-gray-200",
    "group-data-disabled/field:bg-gray-50",
    "group-data-invalid/field:border-red-800",
)}
```

## Schemas

Centralized in `components/atoms/form/schemas.ts`. Progressive validation pattern:

```ts
// Submit (strict) — full email validation
export const emailSchema = z
    .string()
    .min(1, "Required")
    .refine((val) => z.email().safeParse(val).success, "Invalid email");

// onChange (lenient) — don't show errors while typing partial email
export const emailSchemaProgressive = z
    .string()
    .min(1, "Required")
    .refine((val) => partialEmailRegex.test(val), "Invalid email");
```

## Cross-Field Validation (password confirmation)

Use a parent `useState` + `.refine()` to access another field's value:

```tsx
const [password, setPassword] = useState("");

const { register, states, submit, reset } = useForm({
    password: {
        schema: passwordSchema,
        onChangeSchema: passwordSchemaOnChange,
        onBlurSchema: passwordSchemaOnBlur,
        setter: (value: string) => {
            setPassword(value);
            return value;
        },
        defaultValue: "",
    },
    confirmPassword: {
        schema: z
            .string()
            .min(1, "Confirmation required")
            .refine((confirmPassword) => password === confirmPassword, "Passwords do not match"),
        setter: (value: string) => value,
        defaultValue: "",
    },
});
```

The `setter` of `password` stores the value in parent state. The `confirmPassword` schema's `.refine()` captures `password` from the closure.

`states.password` can be used for additional UI (e.g. password strength indicator).

## Submission Patterns

### Standard

```tsx
const handleSubmit: OnSubmit = async (event) => {
    event.preventDefault();

    const values = submit();

    if (!values) return;
    setIsLoading(true);

    try {
        const result = await asyncCall(values);

        toast.add({ title: "Success", description: "...", type: "success" });

        reset();
    } catch {
        toast.add({ title: "Erreur", description: "Une erreur est survenue.", type: "error" });
    }

    setIsLoading(false);
};
```

### With Redirect

Next.js SPA does not unmount components on `router.push()`. Wrap `reset()` and `setIsLoading(false)` in `setTimeout` so the user does not see fields clearing before navigation.

```tsx
const handleSubmit: OnSubmit = async (event) => {
    event.preventDefault();

    const values = submit();

    if (!values) return;
    setIsLoading(true);

    try {
        const result = await asyncCall(values);

        toast.add({ title: "Success", description: "...", type: "success" });

        router.push("/destination");

        setTimeout(() => {
            reset();
            setIsLoading(false);
        }, 1000);

        return;
    } catch {
        toast.add({ title: "Erreur", description: "Une erreur est survenue.", type: "error" });
        setIsLoading(false);
    }
};
```

## Rules

1. **`setIsLoading(false)` outside try-catch** — always reached, no loading stuck state. With redirect: in `setTimeout` (success) and `catch` (error)
2. **No `return` inside try** — ensures `setIsLoading(false)` is reached. Exception: redirect pattern uses `return` because cleanup is in `setTimeout`
3. **`reset()` in `setTimeout` only with redirect** — direct call otherwise
4. **Catch block = generic error** — network failures, unexpected exceptions
5. **Try block = business logic** — API-specific error handling with `if/else`

### Exception: Fire-and-Forget

Some forms intentionally skip error handling for security reasons (e.g., anti-enumeration on password reset). These don't need try-catch.
