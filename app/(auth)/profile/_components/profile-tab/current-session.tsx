import Card from "@atoms/card";
import { Dot } from "lucide-react";
import { getBrowser, getOs } from "./utils";

type CurrentSessionProps = {
    userAgent: string;
};

export default function CurrentSession(props: CurrentSessionProps) {
    const { userAgent } = props;

    return (
        <Card className="py-4">
            <div className="flex flex-row items-center gap-3">
                <div className="min-h-2 min-w-2 rounded-full bg-green-500" />
                <div className="text-sm font-semibold">{`${getOs(userAgent)}, ${getBrowser(userAgent)}`}</div>
                <Dot className="-m-2 scale-110 text-gray-600" />
                <div className="text-sm text-gray-500">Appareil actif</div>
            </div>
        </Card>
    );
}
