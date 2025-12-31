import Button from "@comps/atoms/button/button";
import { Label } from "@comps/atoms/filed/atoms";
import Field from "@comps/atoms/filed/field";
import { Bell } from "lucide-react";

export default function Page() {
    return (
        <div className="space-y-6 p-7">
            <div className="grid grid-cols-3 gap-4">
                <Field>
                    <Label>Default</Label>
                    <Button label="Button" colors="default" />
                </Field>
                <Field>
                    <Label>Default</Label>
                    <Button label="Button" colors="default" disabled />
                </Field>
                <Field>
                    <Label>Default</Label>
                    <Button label="Button" colors="default" loading />
                </Field>

                <Field>
                    <Label>Outline</Label>
                    <Button label="Button" colors="outline" />
                </Field>
                <Field>
                    <Label>Outline</Label>
                    <Button label="Button" colors="outline" disabled />
                </Field>
                <Field>
                    <Label>Outline</Label>
                    <Button label="Button" colors="outline" loading />
                </Field>

                <Field>
                    <Label>Ghost</Label>
                    <Button label="Button" colors="ghost" />
                </Field>
                <Field>
                    <Label>Ghost</Label>
                    <Button label="Button" colors="ghost" disabled />
                </Field>
                <Field>
                    <Label>Ghost</Label>
                    <Button label="Button" colors="ghost" loading />
                </Field>

                <Field>
                    <Label>Primary</Label>
                    <Button label="Button" colors="primary" />
                </Field>
                <Field>
                    <Label>Primary</Label>
                    <Button label="Button" colors="primary" disabled />
                </Field>
                <Field>
                    <Label>Primary</Label>
                    <Button label="Button" colors="primary" loading />
                </Field>

                <Field>
                    <Label>Destructive</Label>
                    <Button label="Button" colors="destructive" />
                </Field>
                <Field>
                    <Label>Destructive</Label>
                    <Button label="Button" colors="destructive" disabled />
                </Field>
                <Field>
                    <Label>Destructive</Label>
                    <Button label="Button" colors="destructive" loading />
                </Field>

                <Field>
                    <Label>Link</Label>
                    <Button label="Button" colors="link" />
                </Field>
                <Field>
                    <Label>Link</Label>
                    <Button label="Button" colors="link" disabled />
                </Field>
                <Field>
                    <Label>Link</Label>
                    <Button label="Button" colors="link" loading />
                </Field>

                <Field>
                    <Label>No style</Label>
                    <Button label="Button" noStyle />
                </Field>
                <Field>
                    <Label>No style</Label>
                    <Button label="Button" noStyle disabled />
                </Field>
                <Field>
                    <Label>No style</Label>
                    <Button label="Button" noStyle loading />
                </Field>

                <Field>
                    <Label>No outline</Label>
                    <Button label="Button" noOutline />
                </Field>
                <Field>
                    <Label>No rounded</Label>
                    <Button label="Button" rounded={false} />
                </Field>
                <Field>
                    <Label>No padding</Label>
                    <Button label="Button" padding={false} />
                </Field>

                <Field>
                    <Label>Padding XS</Label>
                    <Button label="Button" padding="xs" />
                </Field>
                <Field>
                    <Label>Padding SM</Label>
                    <Button label="Button" padding="sm" />
                </Field>
                <Field>
                    <Label>Padding MD</Label>
                    <Button label="Button" padding="md" />
                </Field>

                <Field>
                    <Label>Padding icon</Label>
                    <Button label="Button" padding="icon">
                        <Bell className="size-5" />
                    </Button>
                </Field>
            </div>
        </div>
    );
}
