import Button from "@atoms/button";
import { Star } from "lucide-react";

export default function TriggerVariants() {
    return (
        <div className="flex flex-col gap-6">
            {/* ----- Colors ----- */}
            <div>
                <p className="mb-2 text-sm text-gray-500">Colors</p>
                <div className="flex flex-wrap gap-3">
                    <Button label="Solid" colors="solid">
                        Solid
                    </Button>
                    <Button label="Outline" colors="outline">
                        Outline
                    </Button>
                    <Button label="Ghost" colors="ghost">
                        Ghost
                    </Button>
                    <Button label="Primary" colors="primary">
                        Primary
                    </Button>
                    <Button label="Destructive" colors="destructive">
                        Destructive
                    </Button>
                    <Button label="Link" colors="link">
                        Link
                    </Button>
                </div>
            </div>

            {/* ----- Rounded ----- */}
            <div>
                <p className="mb-2 text-sm text-gray-500">Rounded</p>
                <div className="flex flex-wrap gap-3">
                    <Button label="Rounded md" rounded="md">
                        Rounded md
                    </Button>
                    <Button label="Rounded full" rounded="full">
                        Rounded full
                    </Button>
                    <Button label="Rounded false" rounded={false}>
                        Rounded false
                    </Button>
                </div>
            </div>

            {/* ----- Padding ----- */}
            <div>
                <p className="mb-2 text-sm text-gray-500">Padding</p>
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-xs text-gray-400">md</span>
                        <Button label="Label" padding="md">
                            Label
                        </Button>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-xs text-gray-400">sm</span>
                        <Button label="Label" padding="sm">
                            Label
                        </Button>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-xs text-gray-400">xs</span>
                        <Button label="Label" padding="xs">
                            Label
                        </Button>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-xs text-gray-400">icon</span>
                        <Button label="Star" padding="icon">
                            <Star className="size-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* ----- noStyle / noOutline / noFlex ----- */}
            <div>
                <p className="mb-2 text-sm text-gray-500">Modifiers</p>
                <div className="flex flex-wrap items-center gap-3">
                    <Button label="noStyle" noStyle>
                        noStyle
                    </Button>
                    <Button label="noOutline" noOutline>
                        noOutline
                    </Button>
                    <Button label="noFlex" noFlex>
                        noFlex
                    </Button>
                </div>
            </div>
        </div>
    );
}
