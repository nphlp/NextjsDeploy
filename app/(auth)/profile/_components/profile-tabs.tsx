"use client";

import Tabs, { Indicator, List, Panel, Tab } from "@atoms/tabs";
import { ReactNode } from "react";
import { TabValue } from "../_lib/query-params";
import { useQueryParams } from "../_lib/use-query-params";

type ProfileTabsProps = {
    profilePanel: ReactNode;
    editionPanel: ReactNode;
    securityPanel: ReactNode;
};

export default function ProfileTabs(props: ProfileTabsProps) {
    const { profilePanel, editionPanel, securityPanel } = props;
    const { tab, setTab } = useQueryParams();

    const handleTabChange = (value: TabValue) => setTab(value);

    return (
        <Tabs value={tab} onValueChange={handleTabChange} className="w-full border-none">
            <List className="px-0 shadow-none">
                <Tab className="h-auto cursor-pointer px-4 py-1.5" value="profile">
                    Profil
                </Tab>
                <Tab className="h-auto cursor-pointer px-4 py-1.5" value="edition">
                    Édition
                </Tab>
                <Tab className="h-auto cursor-pointer px-4 py-1.5" value="security">
                    Sécurité
                </Tab>
                <Indicator className="h-8" />
            </List>
            <hr className="mt-2 mb-4 h-px border-gray-200" />
            <Panel value="profile">{profilePanel}</Panel>
            <Panel value="edition">{editionPanel}</Panel>
            <Panel value="security">{securityPanel}</Panel>
        </Tabs>
    );
}
