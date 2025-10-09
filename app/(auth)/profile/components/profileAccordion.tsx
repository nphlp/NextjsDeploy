import { Accordion, AccordionButton, AccordionContent } from "@comps/UI/accordion";
import { Session } from "@lib/authServer";
import ProfileInfo from "./profileInfo";

type ProfileAccordionProps = {
    session: NonNullable<Session>;
    index?: number;
};

export default function ProfileAccordion(props: ProfileAccordionProps) {
    const { session } = props;

    return (
        <Accordion>
            <AccordionButton>
                <div className="text-lg font-bold">Profil</div>
                <div className="text-gray-middle text-xs">Consulter vos informations personnelles.</div>
            </AccordionButton>
            <AccordionContent>
                <div className="space-y-4">
                    <ProfileInfo session={session} />
                    <div className="flex flex-row items-center justify-between gap-2">
                        <div className="flex flex-1 flex-col gap-2">
                            <div className="text-gray-high text-xs font-bold">Expédiés</div>
                            <div className="text-gray-middle text-xl">3</div>
                        </div>
                        <div className="flex flex-1 flex-col gap-2">
                            <div className="text-gray-high text-xs font-bold">En livraison</div>
                            <div className="text-gray-middle text-xl">2</div>
                        </div>
                        <div className="flex flex-1 flex-col gap-2">
                            <div className="text-gray-high text-xs font-bold">Livrés</div>
                            <div className="text-gray-middle text-xl">47</div>
                        </div>
                        <div className="flex flex-1 flex-col gap-2">
                            <div className="text-gray-high text-xs font-bold">Retournés</div>
                            <div className="text-gray-middle text-xl">5</div>
                        </div>
                    </div>
                </div>
            </AccordionContent>
        </Accordion>
    );
}
