import Input, { InputSkeleton } from "@atoms/input/input";
import InputPassword, { InputPasswordSkeleton } from "@atoms/input/input-password";
import TextArea, { TextAreaSkeleton } from "@atoms/input/text-area";
import { SkeletonText } from "@atoms/skeleton";
import cn from "@lib/cn";

export default function Page() {
    const debugTextSkeleton = false;

    return (
        <div className="space-y-4">
            <div>
                <div className="flex w-120 items-start justify-start gap-0">
                    <div className={cn(debugTextSkeleton && "bg-green-100")}>
                        <SkeletonText fontSize="3xs" />
                    </div>
                    <p className={cn("text-3xs", debugTextSkeleton && "bg-purple-100")}>Hello</p>
                </div>

                <div className="flex w-120 items-start justify-start gap-0">
                    <div className={cn(debugTextSkeleton && "bg-yellow-100")}>
                        <SkeletonText fontSize="2xs" />
                    </div>
                    <p className={cn("text-2xs", debugTextSkeleton && "bg-blue-100")}>Hello</p>
                </div>

                <div className="flex w-120 items-start justify-start gap-0">
                    <div className={cn(debugTextSkeleton && "bg-green-100")}>
                        <SkeletonText fontSize="xs" />
                    </div>
                    <p className={cn("text-xs", debugTextSkeleton && "bg-purple-100")}>Hello</p>
                </div>

                <div className="flex w-120 items-start justify-start gap-0">
                    <div className={cn(debugTextSkeleton && "bg-yellow-100")}>
                        <SkeletonText fontSize="sm" />
                    </div>
                    <p className={cn("text-sm", debugTextSkeleton && "bg-blue-100")}>Hello</p>
                </div>

                <div className="flex w-120 items-start justify-start gap-0">
                    <div className={cn(debugTextSkeleton && "bg-green-100")}>
                        <SkeletonText fontSize="md" />
                    </div>
                    <p className={cn("text-md", debugTextSkeleton && "bg-purple-100")}>Hello</p>
                </div>

                <div className="flex w-120 items-start justify-start gap-0">
                    <div className={cn(debugTextSkeleton && "bg-yellow-100")}>
                        <SkeletonText fontSize="lg" />
                    </div>
                    <p className={cn("text-lg", debugTextSkeleton && "bg-blue-100")}>Hello</p>
                </div>

                <div className="flex w-120 items-start justify-start gap-0">
                    <div className={cn(debugTextSkeleton && "bg-green-100")}>
                        <SkeletonText fontSize="xl" />
                    </div>
                    <p className={cn("text-xl", debugTextSkeleton && "bg-purple-100")}>Hello</p>
                </div>

                <div className="flex w-120 items-start justify-start gap-0">
                    <div className={cn(debugTextSkeleton && "bg-yellow-100")}>
                        <SkeletonText fontSize="2xl" />
                    </div>
                    <p className={cn("text-2xl", debugTextSkeleton && "bg-blue-100")}>Hello</p>
                </div>

                <div className="text-nowra1 flex w-120 items-start justify-start gap-0">
                    <div className={cn(debugTextSkeleton && "bg-green-100")}>
                        <SkeletonText fontSize="3xl" />
                    </div>
                    <p className={cn("text-3xl", debugTextSkeleton && "bg-purple-100")}>Hello</p>
                </div>

                <div className="text-nowra1 flex w-120 items-start justify-start gap-0">
                    <div className={cn(debugTextSkeleton && "bg-yellow-100")}>
                        <SkeletonText fontSize="4xl" />
                    </div>
                    <p className={cn("text-4xl", debugTextSkeleton && "bg-blue-100")}>Hello</p>
                </div>
            </div>

            <div className="flex w-120 items-start justify-start gap-2">
                <Input placeholder="Votre nom" />
                <InputSkeleton />
            </div>

            <div className="flex w-120 items-start justify-start gap-2">
                <TextArea placeholder="Entrez la description ici..." />
                <TextAreaSkeleton />
            </div>

            <div className="flex w-120 items-start justify-start gap-2">
                <InputPassword placeholder="Minimum 8 caractères" />
                <InputPasswordSkeleton />
            </div>
        </div>
    );
}
