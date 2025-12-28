import Field from "@comps/atoms/field";
import Menu from "@comps/atoms/menu/menu";
import Select from "@comps/atoms/select/select";
import MenuTheme from "@comps/molecules/menu-theme";
import SelectOrder from "@comps/molecules/select-order";

export default function Page() {
    return (
        <div className="space-y-6 p-7">
            <Field label="Your name" description="Your name will be visible by everyone" />

            <SelectOrder />

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

            <div className="space-y-1">
                <h2 className="text-sm font-medium text-gray-900">Theme mode</h2>
                <MenuTheme />
            </div>
        </div>
    );
}
