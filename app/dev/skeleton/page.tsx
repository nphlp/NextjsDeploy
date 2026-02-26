import Input, { InputSkeleton } from "@atoms/input/input";
import InputPassword, { InputPasswordSkeleton } from "@atoms/input/input-password";
import TextArea, { TextAreaSkeleton } from "@atoms/input/text-area";
import Main from "@core/Main";
import type { Metadata } from "next";
import SkeletonTextConfig from "./_components/skeleton-text-config";

export const metadata: Metadata = {
    title: "Skeleton",
    description: "Skeleton loading state demos for inputs.",
};

export default function Page() {
    return (
        <Main horizontal="stretch">
            <SkeletonTextConfig debugTextSkeleton={false} />

            <div className="w-full space-y-1">
                <h3 className="font-medium">Input</h3>
                <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
                    <Input placeholder="Votre nom" />
                    <InputSkeleton />
                </div>
            </div>

            <div className="w-full space-y-1">
                <h3 className="font-medium">TextArea</h3>
                <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
                    <TextArea placeholder="Entrez la description ici..." />
                    <TextAreaSkeleton />
                </div>
            </div>

            <div className="w-full space-y-1">
                <h3 className="font-medium">InputPassword</h3>
                <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
                    <InputPassword placeholder="Minimum 8 caractères" />
                    <InputPasswordSkeleton />
                </div>
            </div>
        </Main>
    );
}
