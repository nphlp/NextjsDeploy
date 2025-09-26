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
                    className={{ button: "w-full gap-4" }}
                    ref={modalButtonRef}
                    onClick={() => setIsModalOpen(true)}
                >
                    <span>Open Modal</span>
                    <SquareSquare className="scale-x-120 scale-y-90" />
                </Button>
                <Button
                    label="Open Drawer"
                    variant="outline"
                    className={{ button: "w-full gap-4" }}
                    ref={drawerButtonRef}
                    onClick={() => setIsDrawerOpen(true)}
                >
                    <span>Open Drawer</span>
                    <PanelRight className="scale-x-120 scale-y-90" />
                </Button>
            </div>

            <Modal
                className={{
                    cardContainer: "px-5 py-16",
                    card: "max-w-[500px] space-y-4",
                }}
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
                focusToRef={modalButtonRef}
                withCloseButton
            >
                <div className="text-xl font-bold">Title</div>
                <div>Description</div>
                <Button label="Close" ref={modalButtonRef} onClick={() => setIsModalOpen(false)} />
            </Modal>

            <Drawer
                setIsDrawerOpen={setIsDrawerOpen}
                isDrawerOpen={isDrawerOpen}
                focusToRef={drawerButtonRef}
                withCloseButton
            >
                <div className="text-xl font-bold">Title</div>
                <div>Description</div>
                <Button label="Close" ref={drawerButtonRef} onClick={() => setIsDrawerOpen(false)} />
            </Drawer>
        </section>
    );
}
