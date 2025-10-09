import { AccordionGroup } from "@comps/UI/accordion";
import { getSession } from "@lib/authServer";
import { unauthorized } from "next/navigation";
import EditionAccordion from "./components/editionAccordion";
import EmailConfirmModal from "./components/emailConfirmModal";
import ProfileAccordion from "./components/profileAccordion";
import SessionAccordion from "./components/sessionAccordion";

export default async function Page() {
    const session = await getSession();
    if (!session) unauthorized();

    return (
        <div className="w-full space-y-4 p-7">
            <EmailConfirmModal session={session} />
            <AccordionGroup openByDefaultIndex={0}>
                <div className="flex min-h-full flex-col items-center justify-center">
                    <div className="flex w-full flex-col items-center space-y-5 sm:w-2/3 lg:w-1/2">
                        <ProfileAccordion session={session} />
                        <SessionAccordion session={session} />
                        <EditionAccordion session={session} />
                    </div>
                </div>
            </AccordionGroup>
        </div>
    );
}
