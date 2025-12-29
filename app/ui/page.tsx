import Button from "@comps/atoms/button/button";
import Field from "@comps/atoms/field";
import Menu from "@comps/atoms/menu/menu";
import Select from "@comps/atoms/select/select";
import SelectOrder from "@comps/molecules/select-order";

export default function Page() {
    return (
        <div className="space-y-6 p-7">
            <div className="border bg-white p-2">
                <h2 className="text-md mb-2 font-medium text-gray-900 dark:text-gray-100">Colors</h2>
                <div className="grid h-10 grid-cols-2 text-sm *:flex *:items-center *:justify-center *:px-1">
                    <div className="bg-background">Background</div>
                    <div className="bg-foreground text-background">Foreground</div>
                </div>
                <div className="grid h-10 grid-cols-11 text-sm *:flex *:items-center *:justify-center *:px-1">
                    <div className="bg-gray-50">50</div>
                    <div className="bg-gray-100">100</div>
                    <div className="bg-gray-200">200</div>
                    <div className="bg-gray-300">300</div>
                    <div className="bg-gray-400">400</div>
                    <div className="bg-gray-500">500</div>
                    <div className="text-background bg-gray-600">600</div>
                    <div className="text-background bg-gray-700">700</div>
                    <div className="text-background bg-gray-800">800</div>
                    <div className="text-background bg-gray-900">900</div>
                    <div className="text-background bg-gray-950">950</div>
                </div>
            </div>

            <Field label="Your name" description="Your name will be visible by everyone" />

            <Field label="Order by" description="Select the order of items">
                <SelectOrder />
            </Field>

            <Field label="Font" description="Select the main font for the app">
                <Select />
            </Field>

            <Field label="Other fonts" description="Select some other fonts">
                <Select multiple />
            </Field>

            <div className="space-y-1">
                <h2 className="text-sm font-medium text-gray-900">Menus</h2>
                <Menu />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <Field label="Primary">
                    <Button label="Button" colors="primary" />
                </Field>
                <Field label="Primary">
                    <Button label="Button" colors="primary" isDisabled />
                </Field>
                <Field label="Primary">
                    <Button label="Button" colors="primary" isLoading />
                </Field>

                <Field label="Foreground">
                    <Button label="Button" colors="foreground" />
                </Field>
                <Field label="Foreground">
                    <Button label="Button" colors="foreground" isDisabled />
                </Field>
                <Field label="Foreground">
                    <Button label="Button" colors="foreground" isLoading />
                </Field>

                <Field label="Outline">
                    <Button label="Button" colors="outline" />
                </Field>
                <Field label="Outline">
                    <Button label="Button" colors="outline" isDisabled />
                </Field>
                <Field label="Outline">
                    <Button label="Button" colors="outline" isLoading />
                </Field>

                <Field label="Ghost">
                    <Button label="Button" colors="ghost" />
                </Field>
                <Field label="Ghost">
                    <Button label="Button" colors="ghost" isDisabled />
                </Field>
                <Field label="Ghost">
                    <Button label="Button" colors="ghost" isLoading />
                </Field>

                <Field label="Destructive">
                    <Button label="Button" colors="destructive" />
                </Field>
                <Field label="Destructive">
                    <Button label="Button" colors="destructive" isDisabled />
                </Field>
                <Field label="Destructive">
                    <Button label="Button" colors="destructive" isLoading />
                </Field>

                <Field label="No Style">
                    <Button label="Button" noStyle />
                </Field>
                <Field label="No Style">
                    <Button label="Button" noStyle isDisabled />
                </Field>
                <Field label="No Style">
                    <Button label="Button" noStyle isLoading />
                </Field>

                <Field label="No outline">
                    <Button label="Button" noOutline />
                </Field>

                <Field label="No rounded">
                    <Button label="Button" rounded={false} />
                </Field>

                <Field label="No padding">
                    <Button label="Button" padding={false} />
                </Field>
            </div>
        </div>
    );
}
