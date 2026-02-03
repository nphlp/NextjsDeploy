// "use client";

// import Select, { ItemType, renderValue } from "@atoms/select";
// import Label from "@comps/atoms/label";
// import { Item, List, Popup, Portal, Positioner, Trigger, Value } from "@comps/atoms/select/atoms";
// import Skeleton from "@comps/atoms/skeleton";
// import { Prisma } from "@prisma/client/client";
// import { useUpdatedAtQueryParams } from "./queryParamsClientHooks";

// export default function UpdatedAtFilter() {
//     const { updatedAt, setUpdatedAt } = useUpdatedAtQueryParams();

//     const items: ItemType = {
//         asc: "Ascendant",
//         desc: "Descendant",
//     };

//     const placeholder = "Sélectionner un ordre";

//     return (
//         <div className="space-y-1">
//             <Label>Tri par date</Label>
//             <Select
//                 setSelected={(value: string | string[] | null) => setUpdatedAt(value as Prisma.SortOrder | null)}
//                 selected={updatedAt}
//             >
//                 <Trigger className="max-w-auto w-full">
//                     <Value>{(value) => renderValue({ placeholder, value, items })}</Value>
//                 </Trigger>
//                 <Portal>
//                     <Positioner>
//                         <Popup>
//                             <List>
//                                 <Item label="Asc" itemKey="asc" />
//                                 <Item label="Desc" itemKey="desc" />
//                             </List>
//                         </Popup>
//                     </Positioner>
//                 </Portal>
//             </Select>
//         </div>
//     );
// }

// export const UpdatedAtFilterSkeleton = () => {
//     return (
//         <div>
//             <Skeleton className="mb-1 h-4 w-[110px]" />
//             <Skeleton className="h-9 w-full" />
//         </div>
//     );
// };
