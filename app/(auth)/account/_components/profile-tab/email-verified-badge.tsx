import { CircleCheck, CircleX } from "lucide-react";

type EmailVerifiedBadgeProps = {
    isVerified: boolean;
};

export default function EmailVerifiedBadge(props: EmailVerifiedBadgeProps) {
    const { isVerified } = props;
    const Icon = isVerified ? CircleCheck : CircleX;
    const label = isVerified ? "Vérifié" : "Non vérifié";
    const colorClass = isVerified ? "text-green-600" : "text-red-600";
    const strokeClass = isVerified ? "stroke-green-600" : "stroke-red-600";

    return (
        <>
            <Icon className={`size-4 ${strokeClass}`} />
            <span className={colorClass}>{label}</span>
        </>
    );
}
