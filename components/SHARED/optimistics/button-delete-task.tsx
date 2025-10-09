"use client";

import { TaskType } from "@app/task/components/fetch";
import Button, { ButtonClassName } from "@comps/UI/button/button";
import Modal from "@comps/UI/modal/modal";
import { SkeletonContainer, SkeletonText } from "@comps/UI/skeleton";
import { combo } from "@lib/combo";
import { RefetchType } from "@utils/FetchHook";
import { Trash2 } from "lucide-react";
import { Route } from "next";
import { useRouter } from "next/navigation";
import { startTransition, useRef, useState } from "react";
import { DeleteTask } from "@/actions/TaskAction";
import useInstant from "./useInstant";

type SelectUpdateTaskStatusProps = {
    task: TaskType;
    className?: ButtonClassName;
} & (
    | {
          redirectTo: Route;
          refetch?: undefined;
      }
    | {
          redirectTo?: undefined;
          refetch?: RefetchType;
      }
);

export default function ButtonDeleteTask(props: SelectUpdateTaskStatusProps) {
    const { task, className, redirectTo, refetch } = props;

    const router = useRouter();
    const { setData, setOptimisticData } = useInstant(task);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleDelete = () => {
        startTransition(async () => {
            // New item
            const newItem: TaskType = task;

            // Set optimistic state
            setOptimisticData(newItem);

            // Do mutation
            const validatedItem = await DeleteTask({ id: newItem.id });

            // If failed, the optimistic state is rolled back at the end of the transition
            if (!validatedItem) return console.log("❌ Deletion failed");

            // If success, update the real state in a new transition to prevent key conflict
            startTransition(() => setData(validatedItem));

            // If redirection or refetching, do it after the real state change
            if (redirectTo) router.push(redirectTo);
            if (refetch) refetch();

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
                <Trash2 className="size-6" />
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
        <SkeletonContainer className={combo("w-fit px-2", className)} noShrink>
            <SkeletonText width="20px" />
        </SkeletonContainer>
    );
};
