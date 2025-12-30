import cn from "@lib/cn";

type SkeletonProps = {
    className?: string;
};

export default function Skeleton(props: SkeletonProps) {
    const { className } = props;

    return <div className={cn("animate-pulse rounded-md bg-gray-100", className)} />;
}

type SkeletonTextProps = {
    className?: string;
    fontSize?: "3xs" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
    width?: string;
};

export const SkeletonText = (props: SkeletonTextProps) => {
    const { className, fontSize = "md", width } = props;
    const heightClass = () => {
        switch (fontSize) {
            case "3xs":
                return { height: "7px", marginBlock: "2.5px", borderRadius: "1px" };
            case "2xs":
                return { height: "9px", marginBlock: "3px", borderRadius: "1px" };
            case "xs":
                return { height: "10px", marginBlock: "3px", borderRadius: "2px" };
            case "sm":
                return { height: "12px", marginBlock: "4px", borderRadius: "2px" };
            case "md":
                return { height: "14px", marginBlock: "5px", borderRadius: "3px" };
            case "lg":
                return { height: "15px", marginBlock: "6.5px", borderRadius: "3px" };
            case "xl":
                return { height: "17px", marginBlock: "5.5px", borderRadius: "4px" };
            case "2xl":
                return { height: "20px", marginBlock: "6px", borderRadius: "4px" };
            case "3xl":
                return { height: "23px", marginBlock: "6.5px", borderRadius: "5px" };
            case "4xl":
                return { height: "27px", marginBlock: "6.5px", borderRadius: "5px" };
        }
    };

    const { height, marginBlock, borderRadius } = heightClass();

    return (
        <div className="flex flex-col">
            <p
                style={{ height, marginBlock, borderRadius, width }}
                className={cn("w-20 animate-pulse rounded bg-gray-200", className)}
            ></p>
        </div>
    );
};
