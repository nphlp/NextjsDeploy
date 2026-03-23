# Forms

Reference implementation: `app/dev/form/`

## Architecture

```
components/atoms/_form/
├── use-form.ts         # useForm hook — state, validation, register
├── form.tsx            # <Form> wrapper — <form> + FormProvider
├── atom.tsx            # FieldWrapper, Label, RequiredNote, Indication (internal)
├── schemas.ts          # Centralized Zod schemas
├── index.ts            # Public exports
├── _context/           # FormProvider context (register function)
└── _adapters/          # Form-aware wrappers (FormInput, FormSelect, etc.)
```

The form system connects through context: `<Form>` passes the `register` function via `FormProvider` → adapters consume it via `useFormContext()`.

**Key design:** Each adapter internally wraps its content with `FieldWrapper` (label, description, error indication, `data-invalid`/`data-disabled` attributes). There is no external `<Field>` wrapper — adapters handle everything.

## useForm Hook

### Config

Each field is defined with:

| Property         | Required | Purpose                                                                |
| ---------------- | -------- | ---------------------------------------------------------------------- |
| `schema`         | Yes      | Submit validation. Also used for onChange/onBlur if no override        |
| `onChangeSchema` | No       | Progressive validation while typing (e.g. email without full TLD)      |
| `onBlurSchema`   | No       | Validation when user leaves the field                                  |
| `setter`         | Yes      | Transform function before storing (`(value) => value` for passthrough) |
| `defaultValue`   | Yes      | Initial value (`""`, `null`, `[]`, etc.)                               |

### Progressive Validation

The problem: an email field validated with `emailSchema` shows errors while the user is still typing (`"john"` → invalid). The field appears red before the user has finished — frustrating UX.

The solution: 3 validation levels that apply at different moments:

```
onChange → onChangeSchema ?? schema    (while typing)
onBlur  → onBlurSchema   ?? schema    (when leaving the field)
submit  → schema                      (always strict)
```

### Example: email field (login form)

```ts
import { emailSchema, emailSchemaProgressive } from "@atoms/_form";

const { register, submit, reset } = useForm({
    email: {
        // Submit — strict: must be a fully valid email
        schema: emailSchema,
        // onChange — lenient: accepts partial progress while typing
        // "john" → ok, "john@" → ok, "john@ex" → ok, "..john" → error
        onChangeSchema: emailSchemaProgressive,
        // onBlur — permissive: no error if the user just clicked in and out
        onBlurSchema: z.string(),
        setter: (value: string) => value,
        defaultValue: "",
    },
});
```

**`schema` (emailSchema)** — the user clicks "Submit". The email must be fully valid (`john@example.com`). If not, the field shows an error.

**`onChangeSchema` (emailSchemaProgressive)** — the user is typing. `"john"` is accepted (partial progress), `"..john"` is rejected (structurally invalid). The user only sees errors for input that can never become a valid email.

**`onBlurSchema` (z.string())** — the user clicks into the field then tabs away without typing. No error is shown — they just passed through. Without `onBlurSchema`, it would fall back to `schema` and show "email is required".

When `onChangeSchema` or `onBlurSchema` are omitted, they fall back to `schema` (strict at every step). This is useful for registration forms where stricter feedback is desired.

### Return Values

| Value       | Type                                                                        | Purpose                                                          |
| ----------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `register`  | `(fieldName) => { name, value, status, errors, onFocus, onChange, onBlur }` | Bind a field — passed to `<Form>`, consumed by adapters          |
| `states`    | `{ [fieldName]: value }`                                                    | Current values for all fields (read-only access)                 |
| `setStates` | `{ [fieldName]: (value) => void }`                                          | Set a field value programmatically                               |
| `submit`    | `() => validatedData \| undefined`                                          | Validate all fields, return typed data or `undefined` on failure |
| `reset`     | `() => void`                                                                | Reset all fields to `defaultValue`                               |

## Components

### `<Form>` — form wrapper

Wraps `<form>` and provides the `register` function to children via context.

```tsx
<Form register={register} onSubmit={handleSubmit} className="gap-4">
    {children}
</Form>
```

### Form Adapters (`_adapters/`)

Form adapters are `"use client"` wrappers that connect atoms to `useFormContext()`. Each adapter:

1. Reads value and triggers validation through the form context
2. Accepts `FieldProps` (`label`, `description`, `disabled`, `required`) directly
3. Wraps its content with `FieldWrapper` internally (label + error indication + `data-invalid`/`data-disabled`)

The `name` prop must match the field name in `useForm()` config.

Available adapters:

| Adapter                | Wraps              | Notes                          |
| ---------------------- | ------------------ | ------------------------------ |
| `FormInput`            | `Input`            |                                |
| `FormInputPassword`    | `InputPassword`    |                                |
| `FormInputOtp`         | `InputOtp`         |                                |
| `FormTextArea`         | `TextArea`         |                                |
| `FormSelect`           | `Select`           | Composable children (atoms)    |
| `FormSelectMultiple`   | `SelectMultiple`   | Composable children (atoms)    |
| `FormCheckbox`         | `Checkbox`         | Uses `text` prop (not `label`) |
| `FormSwitch`           | `Switch`           | Uses `text` prop (not `label`) |
| `FormCombobox`         | `Combobox`         | Composable children (atoms)    |
| `FormComboboxMultiple` | `ComboboxMultiple` | Composable children (atoms)    |

**`label` vs `text`:** For most adapters, `label` is the field title displayed above the input (via FieldWrapper). For `FormCheckbox` and `FormSwitch`, `text` is the inline text next to the control — `label` is not used because these components have no field title above them.

```tsx
// Input-type adapter — label is the field title above
<FormInput name="email" label="Email" description="Enter your email" required />

// Checkbox/Switch adapter — text is the inline label
<FormCheckbox name="cgv" text="I accept the terms" required />
```

### Tailwind `group-data-*/field:` Classes

`FieldWrapper` sets `data-invalid` and `data-disabled` on its wrapper div with `group/field`. Input atoms use these for conditional styling:

```tsx
className={cn(
    "rounded-md border border-gray-200",
    "group-data-disabled/field:bg-gray-50",
    "group-data-invalid/field:border-red-800",
)}
```

## Schemas

Centralized in `components/atoms/_form/schemas.ts`. Progressive validation pattern:

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
