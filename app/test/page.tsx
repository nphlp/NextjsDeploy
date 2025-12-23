import Field from "@comps/BASEUI/field";
import Menu from "@comps/BASEUI/menu";
import Select from "@comps/BASEUI/select";

export default function Page() {
    return (
        <div className="space-y-6 p-7">
            <Field label="Your name" description="Your name will be visible by everyone" />

            <Field label="Font" description="Select the main font for the app">
                <Select alignItemWithTrigger withScrollArrows />
            </Field>

            <Field label="Other fonts" description="Select some other fonts">
                <Select multiple />
            </Field>

            <div className="space-y-1">
                <h2 className="text-sm font-medium text-gray-900">Menus</h2>
                <div className="flex gap-4">
                    <Menu />
                    <Menu
                        label="Share"
                        items={[
                            { type: "item", label: "Copy link", value: "copy-link" },
                            { type: "separator" },
                            { type: "item", label: "To Facebook", value: "to-facebook" },
                            { type: "item", label: "To Instagram", value: "to-instagram" },
                            { type: "item", label: "To Twitter", value: "to-twitter" },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}
