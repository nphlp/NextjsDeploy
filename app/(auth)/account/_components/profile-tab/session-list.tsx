"use client";

import Card from "@atoms/card";
import { Fragment } from "react";
import { useSessionContext } from "./_context/use-context";
import SessionItem from "./session-item";

export default function SessionList() {
    const { sessions } = useSessionContext();

    return (
        <Card className="py-4 pr-4">
            {sessions.length > 0 ? (
                sessions.map((session, index) => (
                    <Fragment key={session.id}>
                        {index !== 0 && <hr className="border-gray-200" />}
                        <SessionItem session={session} />
                    </Fragment>
                ))
            ) : (
                <div className="text-center text-sm text-gray-500">Aucune autre session n&apos;est active.</div>
            )}
        </Card>
    );
}
