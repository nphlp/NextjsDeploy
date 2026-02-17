import AlertDialog from "@atoms/alert-dialog";
import Dialog from "@atoms/dialog";
import Drawer from "@atoms/drawer";
import DrawerNonModal from "@atoms/drawer/drawer-non-modal";
import DrawerSnapPoints from "@atoms/drawer/drawer-snap-points";
import Main from "@core/Main";
import Section from "./_components/section";

export default function DialogsPage() {
    return (
        <Main horizontal="stretch" vertical="start">
            <h1 className="text-2xl font-bold">Dialogs &amp; Drawers</h1>
            <p className="text-gray-600">All overlay component variants with their built-in demos.</p>

            <Section title="Alert Dialog">
                <AlertDialog />
            </Section>

            <Section title="Dialog">
                <Dialog />
            </Section>

            <Section title="Drawer">
                <Drawer />
            </Section>

            <Section title="Drawer Non-Modal">
                <DrawerNonModal />
            </Section>

            <Section title="Drawer Snap Points">
                <DrawerSnapPoints />
            </Section>
        </Main>
    );
}
