"use client";

import Button, { ButtonClassName } from "@comps/UI/button/button";
import Modal from "@comps/UI/modal/modal";
import { TaskModel } from "@services/types";
import { RefetchType } from "@utils/FetchHook";
import { X } from "lucide-react";
import { Route } from "next";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { DeleteTask } from "@/actions/Task";

type SelectUpdateTaskStatusProps = {
    task: TaskModel;
    className?: ButtonClassName;
} & (
    | {
          redirectTo: Route;
          refetch?: undefined;
      }
    | {
          refetch: RefetchType;
          redirectTo?: undefined;
      }
);

export default function ButtonDeleteTask(props: SelectUpdateTaskStatusProps) {
    const { task, className, redirectTo, refetch } = props;
    const { id } = task;

    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleDelete = async () => {
        await DeleteTask({ id });
        if (redirectTo) return router.push(redirectTo);
        if (refetch) refetch();
    };

    return (
        <>
            <Button
                label={`Status ${task.status}`}
                variant="outline"
                className={className}
                onClick={() => setIsModalOpen(true)}
            >
                <X />
            </Button>
            <Modal
                className={{
                    cardContainer: "px-5 py-16",
                    card: "max-w-[400px] min-w-[200px] space-y-5",
                }}
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
                focusToRef={buttonRef}
                withCross
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
