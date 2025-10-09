import { Accordion, AccordionButton, AccordionContent } from "@comps/UI/accordion";
import { Session, SessionList, getSessionList } from "@lib/authServer";
import { Fetch } from "@utils/Fetch";
import LocationMap from "./locationMap";
import SessionManager, { SessionAndLocation } from "./sessionManager";
import { getBrowser, getOs, locationString } from "./utils";

type SessionAccordionProps = {
    session: NonNullable<Session>;
    index?: number;
};

export default async function SessionAccordion(props: SessionAccordionProps) {
    const { session } = props;

    const sessionList = await getSessionList();

    const sessionListWithoutCurrentSession = sessionList.filter(
        (sessionFromList) => sessionFromList.token !== session.session.token,
    );

    return (
        <Accordion>
            <AccordionButton>
                <div className="text-lg font-bold">Sessions</div>
                <div className="text-gray-middle text-xs">Gérer vos sessions actives.</div>
            </AccordionButton>
            <AccordionContent>
                <div className="space-y-5">
                    <CurrentSession session={session} />
                    <OtherSessions sessionList={sessionListWithoutCurrentSession} />
                </div>
            </AccordionContent>
        </Accordion>
    );
}

type CurrentSessionProps = {
    session: NonNullable<Session>;
};

const CurrentSession = async (props: CurrentSessionProps) => {
    const { session } = props;

    const userAgent = session.session.userAgent ?? "";
    const ipAddress = session.session.ipAddress ?? "";

    const location = await Fetch({ route: "/location", params: { ipAddress } });

    return (
        <div className="border-gray-light space-y-2 rounded-lg border px-5 py-3">
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-3">
                    <div className="min-h-2 min-w-2 rounded-full bg-green-500" />
                    <div>
                        <div className="line-clamp-1">
                            <span className="text-sm font-bold">Current Session</span>
                            <span className="text-gray-middle text-xs"> • </span>
                            <span className="text-gray-middle text-xs">{`${getBrowser(userAgent)}, ${getOs(userAgent)}`}</span>
                        </div>
                        <div className="text-2xs text-gray-middle line-clamp-1">{locationString(location)}</div>
                    </div>
                </div>
            </div>
            <LocationMap location={location} />
        </div>
    );
};

type OtherSessionsProps = {
    sessionList: SessionList;
};

const OtherSessions = async (props: OtherSessionsProps) => {
    const { sessionList } = props;

    const orderedSessionList = sessionList.sort(
        (a, b) => new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime(),
    );

    const location = await Promise.all(
        orderedSessionList.map(({ ipAddress }) =>
            Fetch({
                route: "/location",
                params: { ipAddress: ipAddress ?? "" },
            }),
        ),
    );

    const sessionAndLocationList: SessionAndLocation[] = orderedSessionList.map((session, index) => ({
        session,
        location: location[index],
    }));

    return <SessionManager sessionAndLocationList={sessionAndLocationList} />;
};
