"use client";

import Button from "@comps/UI/button/button";
import Drawer from "@comps/UI/drawer/drawer";
import Modal from "@comps/UI/modal/modal";
import { PanelRight, SquareSquare } from "lucide-react";
import { useRef, useState } from "react";

type PopupSectionProps = {
    className?: string;
};

export default function PopupSection(props: PopupSectionProps) {
    const { className } = props;

    // Modal
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const modalButtonRef = useRef<HTMLButtonElement>(null);

    // Drawer
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const drawerButtonRef = useRef<HTMLButtonElement>(null);

    return (
        <section className={className}>
            <h2 className="border-gray-middle border-b pb-2 text-2xl font-bold">Modal and Drawer</h2>
            <div className="grid grid-cols-2 gap-4">
                <Button
                    label="Open Modal"
                    variant="outline"
                    className={{ button: "w-full", text: "flex items-center gap-4" }}
                    ref={modalButtonRef}
                    onClick={() => setIsModalOpen(true)}
                >
                    <span>Open Modal</span>
                    <SquareSquare className="size-5 stroke-[1.4px]" />
                </Button>
                <Button
                    label="Open Drawer"
                    variant="outline"
                    className={{ button: "w-full", text: "flex items-center gap-4" }}
                    ref={drawerButtonRef}
                    onClick={() => setIsDrawerOpen(true)}
                >
                    <span>Open Drawer</span>
                    <PanelRight className="size-5 stroke-[1.4px]" />
                </Button>
            </div>

            <Modal
                className={{
                    // Outside the modal
                    cardContainer: "px-5 py-16",
                    // Inside the modal
                    card: "max-w-[500px] min-w-[200px] space-y-4",
                }}
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
                focusToRef={modalButtonRef}
                withCloseButton
            >
                <div className="text-xl font-bold">Title</div>
                <div>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsa excepturi odit quaerat similique
                    debitis laborum qui quisquam id nostrum? Omnis sequi distinctio rem nulla officia voluptatibus quis,
                    odio laborum? Nihil!
                </div>
                <Button label="Close" ref={modalButtonRef} onClick={() => setIsModalOpen(false)} />
            </Modal>

            <Drawer
                className={{
                    drawer: "space-y-4",
                }}
                setIsDrawerOpen={setIsDrawerOpen}
                isDrawerOpen={isDrawerOpen}
                focusToRef={drawerButtonRef}
                withCloseButton
            >
                <div className="text-xl font-bold">Title</div>
                <div>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsa excepturi odit quaerat similique
                    debitis laborum qui quisquam id nostrum? Omnis sequi distinctio rem nulla officia voluptatibus quis,
                    odio laborum? Nihil!
                </div>
                <Button label="Close" ref={drawerButtonRef} onClick={() => setIsDrawerOpen(false)} />
            </Drawer>
        </section>
    );
}
