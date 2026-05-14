import Accordion from "@atoms/accordion";
import AlertDialog, { AlertDialogLongContent } from "@atoms/alert-dialog";
import { CardButton, CardLink } from "@atoms/card";
import Checkbox from "@atoms/checkbox";
import CheckboxChip from "@atoms/checkbox/checkbox-chip";
import Collapsible from "@atoms/collapsible";
import Combobox from "@atoms/combobox";
import ComboboxCreatable from "@atoms/combobox/combobox-creatable";
import ComboboxMultiple from "@atoms/combobox/combobox-multiple";
import ContextMenu from "@atoms/context-menu";
import Dialog, { DialogLongContent } from "@atoms/dialog";
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
import Main from "@core/main";
import type { Metadata } from "next";
import CarouselDemo from "./_components/carousel-demo";
import ComboboxAsyncDemo from "./_components/combobox-async-demo";
import ComboboxMultipleAsyncDemo from "./_components/combobox-multiple-async-demo";
import InputDemo from "./_components/input-demo";
import KbdDemo from "./_components/kbd-demo";
import Section from "./_components/section";
import TriggerVariants from "./_components/trigger-variants";

export const metadata: Metadata = {
    title: "Components",
    description: "Showcase of Base-UI components with demos and variants.",
};

export default async function ComponentsPage() {
    return (
        <Main horizontal="stretch" vertical="start">
            <h1 className="text-2xl font-bold">Components</h1>
            <p className="text-gray-600">Base-UI component showcase — demos and variants.</p>

            {/* ----- Trigger Variants ----- */}
            <Section title="Trigger Variants (buttonStyle)">
                <TriggerVariants />
            </Section>

            {/* ----- Card ----- */}
            <Section title="Card">
                <div className="w-full max-w-md">
                    <p className="mb-2 text-sm text-gray-500">CardLink (link overlay)</p>
                    <CardLink />
                </div>
                <div className="w-full max-w-md">
                    <p className="mb-2 text-sm text-gray-500">CardButton (button overlay)</p>
                    <CardButton />
                </div>
            </Section>

            {/* ----- Alert Dialog ----- */}
            <Section title="Alert Dialog">
                <div>
                    <p className="mb-2 text-sm text-gray-500">Default — short body</p>
                    <AlertDialog />
                </div>
                <div>
                    <p className="mb-2 text-sm text-gray-500">
                        Long content — Content scrolls under sticky Header / Footer
                    </p>
                    <AlertDialogLongContent />
                </div>
            </Section>

            {/* ----- Dialog ----- */}
            <Section title="Dialog">
                <div>
                    <p className="mb-2 text-sm text-gray-500">Default — short body</p>
                    <Dialog />
                </div>
                <div>
                    <p className="mb-2 text-sm text-gray-500">
                        Long content — Content scrolls under sticky Header / Footer
                    </p>
                    <DialogLongContent />
                </div>
            </Section>

            {/* ----- Collapsible ----- */}
            <Section title="Collapsible">
                <Collapsible />
            </Section>

            {/* ----- Tabs ----- */}
            <Section title="Tabs">
                <div>
                    <p className="mb-2 text-sm text-gray-500">Demo</p>
                    <Tabs />
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
                    <p className="mb-2 text-sm text-gray-500">Chip</p>
                    <SwitchChip text="Dark mode" />
                </div>
            </Section>

            {/* ----- Drawer ----- */}
            <Section title="Drawer">
                <div>
                    <p className="mb-2 text-sm text-gray-500">Demo</p>
                    <Drawer />
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
                <Popover />
            </Section>

            {/* ----- Slider ----- */}
            <Section title="Slider">
                <div>
                    <p className="mb-2 text-sm text-gray-500">Demo</p>
                    <Slider />
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
                    <p className="mb-2 text-sm text-gray-500">Multiple</p>
                    <ComboboxMultiple />
                </div>
                <div>
                    <p className="mb-2 text-sm text-gray-500">Async</p>
                    <ComboboxAsyncDemo />
                </div>
                <div>
                    <p className="mb-2 text-sm text-gray-500">Multiple Async</p>
                    <ComboboxMultipleAsyncDemo />
                </div>
                <div>
                    <p className="mb-2 text-sm text-gray-500">Creatable</p>
                    <ComboboxCreatable />
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
                <div>
                    <p className="mb-2 text-sm text-gray-500">Demo</p>
                    <Checkbox />
                </div>
                <div>
                    <p className="mb-2 text-sm text-gray-500">Chip</p>
                    <CheckboxChip text="Dark mode" />
                </div>
            </Section>

            {/* ----- Context Menu ----- */}
            <Section title="Context Menu">
                <ContextMenu />
            </Section>

            {/* ----- Input ----- */}
            <Section title="Input">
                <InputDemo />
            </Section>

            {/* ----- Carousel ----- */}
            <Section title="Carousel">
                <CarouselDemo />
            </Section>

            {/* ----- Kbd ----- */}
            <Section title="Kbd">
                <KbdDemo />
            </Section>
        </Main>
    );
}
