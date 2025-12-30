import cn from "@lib/cn";

type SkeletonProps = {
    className?: string;
};

export default function Skeleton(props: SkeletonProps) {
    const { className } = props;

    return <div className={cn("animate-pulse rounded-md bg-gray-100", className)} />;
}
