// "use client";

// import { useToast } from "@atoms/toast";
// import { Item, List, Popup, Portal, Positioner, Root, Trigger, Value } from "@comps/atoms/select/atoms";
// import Skeleton from "@comps/atoms/skeleton";
// import cn from "@lib/cn";
// import oRPC from "@lib/orpc";
// import { CircleCheckBig, CircleDashed, LoaderCircle } from "lucide-react";
// import { ReactNode, startTransition } from "react";
// import { TaskType } from "./types";
// import useInstant from "./useInstant";

// type SelectOptionType = {
//     slug: string;
//     label: ReactNode;
// };

// const options: SelectOptionType[] = [
//     {
//         slug: "TODO",
//         label: (
//             <div className="flex items-center gap-2">
//                 <CircleDashed className="size-4" />
//                 <span>À faire</span>
//             </div>
//         ),
//     },
//     {
//         slug: "IN_PROGRESS",
//         label: (
//             <div className="flex items-center gap-2">
//                 <LoaderCircle className="size-4" />
//                 <span>En cours</span>
//             </div>
//         ),
//     },
//     {
//         slug: "DONE",
//         label: (
//             <div className="flex items-center gap-2">
//                 <CircleCheckBig className="size-4" />
//                 <span>Terminé</span>
//             </div>
//         ),
//     },
// ];

// type SelectUpdateTaskStatusProps = {
//     task: TaskType;
//     className?: string;
// };

// export default function SelectUpdateTaskStatus(props: SelectUpdateTaskStatusProps) {
//     const { task } = props;
//     const { id, title } = task;
//     const toast = useToast();

//     const { optimisticData, setData, setOptimisticData } = useInstant(task);

//     const handleStatusUpdate = (newStatus: string) => {
//         const newStatusConst = newStatus as TaskType["status"];
//         startTransition(async () => {
//             // New item
//             const updatedItem: TaskType = { id, title, status: newStatusConst };

//             // Set optimistic state
//             setOptimisticData(updatedItem);

//             try {
//                 // Do mutation
//                 const data = await oRPC.task.update({ id, status: newStatusConst });

//                 // If success, update the real state in a new transition to prevent key conflict
//                 startTransition(() => setData(data));

//                 toast.add({
//                     title: "Statut modifié",
//                     description: "Les modifications ont été enregistrées.",
//                     type: "success",
//                 });
//             } catch {
//                 // If failed, the optimistic state is rolled back at the end of the transition
//                 toast.add({ title: "Erreur", description: "Impossible de modifier le statut.", type: "error" });
//             }
//         });
//     };

//     const renderValue = (value: string | string[] | null) => {
//         if (!value || Array.isArray(value)) return null;
//         const option = options.find((o) => o.slug === value);
//         return option?.label ?? value;
//     };

//     return (
//         <Root selected={optimisticData.status} onSelect={(value) => handleStatusUpdate(value as string)}>
//             <Trigger>
//                 <Value>{renderValue}</Value>
//             </Trigger>
//             <Portal>
//                 <Positioner>
//                     <Popup>
//                         <List>
//                             {options.map((option) => (
//                                 <Item key={option.slug} label={option.slug} itemKey={option.slug} />
//                             ))}
//                         </List>
//                     </Popup>
//                 </Positioner>
//             </Portal>
//         </Root>
//     );
// }

// type SelectUpdateTaskStatusSkeletonProps = {
//     className?: string;
//     index?: number;
//     noShrink?: boolean;
// };

// export const SelectUpdateTaskStatusSkeleton = (props: SelectUpdateTaskStatusSkeletonProps) => {
//     const { className } = props;

//     return <Skeleton className={cn("h-9 w-[150px]", className)} />;
// };
