import Button from "@atoms/button";
import Field from "@atoms/filed";
import { Bell } from "lucide-react";

export default function ButtonConfig() {
    return (
        <div className="grid grid-cols-3 gap-4">
            <Field label="Default">
                <Button label="Button" colors="default" />
            </Field>
            <Field label="Default">
                <Button label="Button" colors="default" disabled />
            </Field>
            <Field label="Default">
                <Button label="Button" colors="default" loading />
            </Field>

            <Field label="Outline">
                <Button label="Button" colors="outline" />
            </Field>
            <Field label="Outline">
                <Button label="Button" colors="outline" disabled />
            </Field>
            <Field label="Outline">
                <Button label="Button" colors="outline" loading />
            </Field>

            <Field label="Ghost">
                <Button label="Button" colors="ghost" />
            </Field>
            <Field label="Ghost">
                <Button label="Button" colors="ghost" disabled />
            </Field>
            <Field label="Ghost">
                <Button label="Button" colors="ghost" loading />
            </Field>

            <Field label="Primary">
                <Button label="Button" colors="primary" />
            </Field>
            <Field label="Primary">
                <Button label="Button" colors="primary" disabled />
            </Field>
            <Field label="Primary">
                <Button label="Button" colors="primary" loading />
            </Field>

            <Field label="Destructive">
                <Button label="Button" colors="destructive" />
            </Field>
            <Field label="Destructive">
                <Button label="Button" colors="destructive" disabled />
            </Field>
            <Field label="Destructive">
                <Button label="Button" colors="destructive" loading />
            </Field>

            <Field label="Link">
                <Button label="Button" colors="link" />
            </Field>
            <Field label="Link">
                <Button label="Button" colors="link" disabled />
            </Field>
            <Field label="Link">
                <Button label="Button" colors="link" loading />
            </Field>

            <Field label="No">
                <Button label="Button" noStyle />
            </Field>
            <Field label="No">
                <Button label="Button" noStyle disabled />
            </Field>
            <Field label="No">
                <Button label="Button" noStyle loading />
            </Field>

            <Field label="No">
                <Button label="Button" noOutline />
            </Field>
            <Field label="No">
                <Button label="Button" rounded={false} />
            </Field>
            <Field label="No">
                <Button label="Button" padding={false} />
            </Field>

            <Field label="Padding">
                <Button label="Button" padding="xs" />
            </Field>
            <Field label="Padding">
                <Button label="Button" padding="sm" />
            </Field>
            <Field label="Padding">
                <Button label="Button" padding="md" />
            </Field>

            <Field label="Padding">
                <Button label="Button" padding="icon">
                    <Bell className="size-5" />
                </Button>
            </Field>
        </div>
    );
}
