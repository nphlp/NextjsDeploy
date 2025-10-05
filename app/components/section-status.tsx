import { SkeletonText } from "@comps/UI/skeleton";
import { TaskType } from "./fetch";
import Item, { ItemSkeleton } from "./item";

type SectionStatusProps = {
    title: string;
    tasks: TaskType[];
};

export default function SectionStatus(props: SectionStatusProps) {
    const { title, tasks } = props;

    if (!tasks.length) return null;

    return (
        <div className="space-y-2">
            <h2 className="text-lg font-bold">{title}</h2>
            {tasks.map((task) => (
                <Item key={task.id} task={task} />
            ))}
        </div>
    );
}

export const SectionStatusSkeleton = () => {
    return (
        <div className="space-y-2">
            <SkeletonText width="120px" fontSize="lg" />
            {Array.from({ length: 3 }).map((_, index) => (
                <ItemSkeleton key={index} index={index} />
            ))}
        </div>
    );
};
