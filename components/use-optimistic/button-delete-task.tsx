// "use client";

// import { Context } from "@app/tasks/_components/context";
// import { useToast } from "@atoms/toast";
// import Button from "@comps/atoms/button/button";
// import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@comps/atoms/dialog";
// import Skeleton from "@comps/atoms/skeleton";
// import cn from "@lib/cn";
// import oRPC from "@lib/orpc";
// import { Trash2 } from "lucide-react";
// import { Route } from "next";
// import { useRouter } from "next/navigation";
// import { startTransition, useContext, useState } from "react";
// import { TaskType } from "./types";

// type SelectUpdateTaskStatusProps = {
//     task: TaskType;
//     className?: string;
//     redirectTo?: Route;
// };

// export default function ButtonDeleteTask(props: SelectUpdateTaskStatusProps) {
//     const { task, className, redirectTo } = props;
//     const toast = useToast();

//     // This context may be undefined if used outside of a provider
//     const setDataBypass = useContext(Context)?.setDataBypass;
//     const setOptimisticData = useContext(Context)?.setOptimisticData;
//     const optimisticMutations = useContext(Context)?.optimisticMutations;

//     const router = useRouter();

//     const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

//     const handleDelete = () => {
//         startTransition(async () => {
//             // Set optimistic state
//             if (setOptimisticData) setOptimisticData({ type: "delete", newItem: task });

//             try {
//                 // Do mutation
//                 const data = await oRPC.task.delete({ id: task.id });

//                 // Close modal
//                 setIsModalOpen(false);

//                 // If redirection is defined, do not need updating state
//                 if (redirectTo) {
//                     setTimeout(() => {
//                         router.push(redirectTo);
//                     }, 200);
//                 }

//                 // If success, update the real state in a new transition to prevent key conflict
//                 if (!redirectTo) {
//                     startTransition(async () =>
//                         setDataBypass((current) => optimisticMutations(current, { type: "delete", newItem: data })),
//                     );
//                 }

//                 toast.add({
//                     title: "Tâche supprimée",
//                     description: "La tâche a été retirée de la liste.",
//                     type: "success",
//                 });
//             } catch {
//                 // If failed, the optimistic state is rolled back at the end of the transition
//                 toast.add({ title: "Erreur", description: "Impossible de supprimer la tâche.", type: "error" });
//             }
//         });
//     };

//     return (
//         <>
//             <Button
//                 label={`Delete ${task.title}`}
//                 colors="outline"
//                 className={className}
//                 onClick={() => setIsModalOpen(true)}
//             >
//                 <Trash2 className="size-6" />
//             </Button>

//             <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//                 <DialogContent className="max-w-[500px]">
//                     <DialogTitle>Confirmer la suppression</DialogTitle>
//                     <DialogDescription>Êtes-vous sûr de vouloir supprimer cette tâche ?</DialogDescription>
//                     <div className="mt-4 flex justify-end gap-2">
//                         <DialogClose>Annuler</DialogClose>
//                         <Button label="Supprimer" colors="destructive" onClick={handleDelete}>
//                             Supprimer
//                         </Button>
//                     </div>
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// }

// type ButtonDeleteTaskSkeletonProps = {
//     className?: string;
// };

// export const ButtonDeleteTaskSkeleton = (props: ButtonDeleteTaskSkeletonProps) => {
//     const { className } = props;

//     return <Skeleton className={cn("h-9 w-9", className)} />;
// };
