"use client";

import { Context } from "@app/components/context";
import { TaskType } from "@app/components/fetch";
import Button, { ButtonClassName } from "@comps/UI/button/button";
import Modal from "@comps/UI/modal/modal";
import { SkeletonContainer, SkeletonText } from "@comps/UI/skeleton";
import { combo } from "@lib/combo";
import { Trash2 } from "lucide-react";
import { startTransition, useContext, useRef, useState } from "react";
import { DeleteTask } from "@/actions/Task";

type SelectUpdateTaskStatusProps = {
    task: TaskType;
    className?: ButtonClassName;
};

export default function ButtonDeleteTask(props: SelectUpdateTaskStatusProps) {
    const { task, className } = props;

    const { setData, setOptimisticData, optimisticMutations } = useContext(Context);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleDelete = () => {
        startTransition(async () => {
            // New item
            const newItem: TaskType = task;

            // Set optimistic state
            setOptimisticData({ type: "delete", newItem });

            // Do mutation
            const validatedItem = await DeleteTask({ id: newItem.id });

            // If failed, the optimistic state is rolled back at the end of the transition
            if (!validatedItem) return console.log("❌ Deletion failed");

            // If success, update the real state in a new transition to prevent key conflict
            startTransition(() =>
                setData((current) => optimisticMutations(current, { type: "delete", newItem: validatedItem })),
            );

            console.log("✅ Deletion succeeded");
        });
    };

    return (
        <>
            <Button
                label={`Status ${task.status}`}
                variant="outline"
                className={className}
                onClick={() => setIsModalOpen(true)}
            >
                <Trash2 />
            </Button>
            <Modal
                className={{
                    cardContainer: "px-5 py-16",
                    card: "max-w-[500px] min-w-[250px] space-y-5",
                }}
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
                focusToRef={buttonRef}
                withCloseButton
            >
                <h2 className="text-lg font-bold">Confirmer la suppression</h2>
                <p>Êtes-vous sûr de vouloir supprimer cette tâche ?</p>
                <div className="flex justify-center gap-2">
                    <Button label="Annuler" variant="outline" onClick={() => setIsModalOpen(false)} />
                    <Button ref={buttonRef} label="Supprimer" variant="destructive" onClick={handleDelete} />
                </div>
            </Modal>
        </>
    );
}

type ButtonDeleteTaskSkeletonProps = {
    className?: string;
};

export const ButtonDeleteTaskSkeleton = (props: ButtonDeleteTaskSkeletonProps) => {
    const { className } = props;

    return (
        <SkeletonContainer className={combo("w-fit px-2", className)}>
            <SkeletonText width="20px" noShrink />
        </SkeletonContainer>
    );
};
