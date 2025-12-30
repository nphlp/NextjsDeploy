import Input, { InputSkeleton } from "@atoms/input/input";
import InputPassword, { InputPasswordSkeleton } from "@atoms/input/input-password";
import TextArea, { TextAreaSkeleton } from "@atoms/input/text-area";
import Skeleton from "@atoms/skeleton";

export default function Page() {
    return (
        <div className="space-y-4">
            <div className="flex w-120 items-start justify-start gap-2">
                <div>
                    <p className="bg-amber-100">Hello HOW are you ???</p>
                    <p className="bg-amber-100">Hello HOW are you ???</p>
                </div>
                <div>
                    <Skeleton />
                    <Skeleton />
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
