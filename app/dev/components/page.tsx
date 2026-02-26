import AlertDialog from "@atoms/alert-dialog";
import Collapsible from "@atoms/collapsible";
import Combobox from "@atoms/combobox";
import Dialog from "@atoms/dialog";
import Drawer from "@atoms/drawer";
import Slider from "@atoms/slider";
import Switch from "@atoms/switch";
import Tabs from "@atoms/tabs";
import Tooltip from "@atoms/tooltip";
import Main from "@core/Main";
import type { Metadata } from "next";
import AlertDialogComposed from "./_components/alert-dialog-composed";
import CollapsibleComposed from "./_components/collapsible-composed";
import ComboboxComposed from "./_components/combobox-composed";
import DialogComposed from "./_components/dialog-composed";
import DrawerComposed from "./_components/drawer-composed";
import Section from "./_components/section";
import SliderComposed from "./_components/slider-composed";
import SwitchComposed from "./_components/switch-composed";
import TabsComposed from "./_components/tabs-composed";
import TooltipComposed from "./_components/tooltip-composed";

export const metadata: Metadata = {
    title: "Components",
    description: "Showcase of Base-UI components with default and composed demos.",
};

export default function ComponentsPage() {
    return (
        <Main horizontal="stretch" vertical="start">
            <h1 className="text-2xl font-bold">Components</h1>
            <p className="text-gray-600">
                Showcase of the 9 standard Base-UI components. Each section shows a default demo and a composed usage.
            </p>

            {/* ----- Alert Dialog ----- */}
            <Section title="Alert Dialog">
                <div>
                    <p className="mb-2 text-sm text-gray-500">Demo</p>
                    <AlertDialog />
                </div>
                <div>
                    <p className="mb-2 text-sm text-gray-500">Composed</p>
                    <AlertDialogComposed />
                </div>
            </Section>

            {/* ----- Dialog ----- */}
            <Section title="Dialog">
                <div>
                    <p className="mb-2 text-sm text-gray-500">Demo</p>
                    <Dialog />
                </div>
                <div>
                    <p className="mb-2 text-sm text-gray-500">Composed</p>
                    <DialogComposed />
                </div>
            </Section>

            {/* ----- Collapsible ----- */}
            <Section title="Collapsible">
                <div>
                    <p className="mb-2 text-sm text-gray-500">Demo</p>
                    <Collapsible />
                </div>
                <div>
                    <p className="mb-2 text-sm text-gray-500">Composed</p>
                    <CollapsibleComposed />
                </div>
            </Section>

            {/* ----- Tabs ----- */}
            <Section title="Tabs">
                <div>
                    <p className="mb-2 text-sm text-gray-500">Demo</p>
                    <Tabs />
                </div>
                <div>
                    <p className="mb-2 text-sm text-gray-500">Composed</p>
                    <TabsComposed />
                </div>
            </Section>

            {/* ----- Switch ----- */}
            <Section title="Switch">
                <div>
                    <p className="mb-2 text-sm text-gray-500">Demo</p>
                    <Switch />
                </div>
                <div>
                    <p className="mb-2 text-sm text-gray-500">Composed</p>
                    <SwitchComposed />
                </div>
            </Section>

            {/* ----- Drawer ----- */}
            <Section title="Drawer">
                <div>
                    <p className="mb-2 text-sm text-gray-500">Demo</p>
                    <Drawer />
                </div>
                <div>
                    <p className="mb-2 text-sm text-gray-500">Composed</p>
                    <DrawerComposed />
                </div>
            </Section>

            {/* ----- Tooltip ----- */}
            <Section title="Tooltip">
                <div>
                    <p className="mb-2 text-sm text-gray-500">Demo</p>
                    <Tooltip />
                </div>
                <div>
                    <p className="mb-2 text-sm text-gray-500">Composed</p>
                    <TooltipComposed />
                </div>
            </Section>

            {/* ----- Slider ----- */}
            <Section title="Slider">
                <div>
                    <p className="mb-2 text-sm text-gray-500">Demo</p>
                    <Slider />
                </div>
                <div>
                    <p className="mb-2 text-sm text-gray-500">Composed</p>
                    <SliderComposed />
                </div>
            </Section>

            {/* ----- Combobox ----- */}
            <Section title="Combobox">
                <div>
                    <p className="mb-2 text-sm text-gray-500">Demo</p>
                    <Combobox />
                </div>
                <div>
                    <p className="mb-2 text-sm text-gray-500">Composed</p>
                    <ComboboxComposed />
                </div>
            </Section>
        </Main>
    );
}
