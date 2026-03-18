import Accordion from "@atoms/accordion";
import AlertDialog from "@atoms/alert-dialog";
import Checkbox from "@atoms/checkbox";
import Collapsible from "@atoms/collapsible";
import Combobox from "@atoms/combobox";
import ComboboxAsync from "@atoms/combobox/combobox-async";
import ComboboxMultiple from "@atoms/combobox/combobox-multiple";
import ComboboxMultipleAsync from "@atoms/combobox/combobox-multiple-async";
import ContextMenu from "@atoms/context-menu";
import Dialog from "@atoms/dialog";
import Drawer from "@atoms/drawer";
import DrawerNonModal from "@atoms/drawer/drawer-non-modal";
import DrawerSnapPoints from "@atoms/drawer/drawer-snap-points";
import Menu from "@atoms/menu";
import Popover from "@atoms/popover";
import Select from "@atoms/select";
import SelectMultiple from "@atoms/select/select-multiple";
import Slider from "@atoms/slider";
import SliderRange from "@atoms/slider/slider-range";
import Switch from "@atoms/switch";
import SwitchChip from "@atoms/switch/switch-chip";
import Tabs from "@atoms/tabs";
import TabsVertical from "@atoms/tabs/tabs-vertical";
import Main from "@core/Main";
import type { Metadata } from "next";
import AlertDialogComposed from "./_components/alert-dialog-composed";
import CollapsibleComposed from "./_components/collapsible-composed";
import ComboboxComposed from "./_components/combobox-composed";
import DialogComposed from "./_components/dialog-composed";
import DrawerComposed from "./_components/drawer-composed";
import PopoverComposed from "./_components/popover-composed";
import Section from "./_components/section";
import SliderComposed from "./_components/slider-composed";
import SwitchComposed from "./_components/switch-composed";
import TabsComposed from "./_components/tabs-composed";
import TriggerVariants from "./_components/trigger-variants";

export const metadata: Metadata = {
    title: "Components",
    description: "Showcase of Base-UI components with demos, composed usage, and trigger variants.",
};

export default async function ComponentsPage() {
    return (
        <Main horizontal="stretch" vertical="start">
            <h1 className="text-2xl font-bold">Components</h1>
            <p className="text-gray-600">Base-UI component showcase — demos, composed usage, and trigger variants.</p>

            {/* ----- Trigger Variants ----- */}
            <Section title="Trigger Variants (buttonStyle)">
                <TriggerVariants />
            </Section>

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
                <div>
                    <p className="mb-2 text-sm text-gray-500">Vertical</p>
                    <TabsVertical />
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
                <div>
                    <p className="mb-2 text-sm text-gray-500">Chip</p>
                    <SwitchChip label="Dark mode" checkedLabel="Dark mode" />
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
                <div>
                    <p className="mb-2 text-sm text-gray-500">Non-Modal</p>
                    <DrawerNonModal />
                </div>
                <div>
                    <p className="mb-2 text-sm text-gray-500">Snap Points</p>
                    <DrawerSnapPoints />
                </div>
            </Section>

            {/* ----- Popover ----- */}
            <Section title="Popover">
                <div>
                    <p className="mb-2 text-sm text-gray-500">Demo</p>
                    <Popover />
                </div>
                <div>
                    <p className="mb-2 text-sm text-gray-500">Composed</p>
                    <PopoverComposed />
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
                <div>
                    <p className="mb-2 text-sm text-gray-500">Range</p>
                    <SliderRange />
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
                <div>
                    <p className="mb-2 text-sm text-gray-500">Multiple</p>
                    <ComboboxMultiple />
                </div>
                <div>
                    <p className="mb-2 text-sm text-gray-500">Async</p>
                    <ComboboxAsync />
                </div>
                <div>
                    <p className="mb-2 text-sm text-gray-500">Multiple Async</p>
                    <ComboboxMultipleAsync />
                </div>
            </Section>

            {/* ----- Select ----- */}
            <Section title="Select">
                <div>
                    <p className="mb-2 text-sm text-gray-500">Demo</p>
                    <Select />
                </div>
                <div>
                    <p className="mb-2 text-sm text-gray-500">Multiple</p>
                    <SelectMultiple />
                </div>
            </Section>

            {/* ----- Menu ----- */}
            <Section title="Menu">
                <Menu />
            </Section>

            {/* ----- Accordion ----- */}
            <Section title="Accordion">
                <Accordion />
            </Section>

            {/* ----- Checkbox ----- */}
            <Section title="Checkbox">
                <Checkbox />
            </Section>

            {/* ----- Context Menu ----- */}
            <Section title="Context Menu">
                <ContextMenu />
            </Section>
        </Main>
    );
}
