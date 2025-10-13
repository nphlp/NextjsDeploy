"use client";

import Card from "@comps/UI/card";
import { useContext } from "react";
import { Context } from "./context";
import Schedule from "./schedule";

export default function DisplayPeriods() {
    const { data: user } = useContext(Context);

    if (!user) throw new Error("No user in DisplayPeriods");

    const overlappingSchedules: boolean = user.Contracts.some((contract) =>
        contract.Schedules.some((schedule1, i) => {
            // Comparer avec les schedules suivants uniquement (évite les doublons et la comparaison avec soi-même)
            return contract.Schedules.slice(i + 1).some((schedule2) => {
                const s1 = schedule1.startDate;
                const e1 = schedule1.endDate;
                const s2 = schedule2.startDate;
                const e2 = schedule2.endDate;

                // Cas 1: Les deux périodes sont infinies (pas de date de fin)
                if (!e1 && !e2) return true;

                // Cas 2: schedule1 est infini, schedule2 est fini
                if (!e1 && e2) return s1 <= e2; // schedule1 commence avant ou le même jour que la fin de schedule2

                // Cas 3: schedule1 est fini, schedule2 est infini
                if (e1 && !e2) return s2 <= e1; // schedule2 commence avant ou le même jour que la fin de schedule1

                // Cas 4: Les deux sont finies - chevauchement (dates de fin incluses)
                if (e1 && e2) return s1 <= e2 && e1 >= s2;

                return false;
            });
        }),
    );

    return (
        <Card className="space-y-4">
            <h2 className="text-foreground text-sm font-bold">
                Planifications pour {user.name} {user.lastname}
            </h2>
            {user?.Contracts.map((contract) =>
                contract.Schedules.map((schedule, index) => <Schedule key={index} index={index} schedule={schedule} />),
            )}
            <div className="text-foreground text-sm font-bold">
                <span>Chevauchement de périodes: </span>
                {overlappingSchedules ? (
                    <span className="text-red-400">Oui</span>
                ) : (
                    <span className="text-green-500">Non</span>
                )}
            </div>
        </Card>
    );
}
