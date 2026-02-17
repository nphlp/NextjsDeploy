"use client";

import Tabs, { Indicator, List, Panel, Tab } from "@atoms/tabs";

export default function TabsComposed() {
    return (
        <Tabs defaultValue="general" className="w-60">
            <List>
                <Tab value="general">General</Tab>
                <Tab value="security">Security</Tab>
                <Indicator />
            </List>
            <Panel value="general" className="h-32 p-4 text-sm">
                General settings content
            </Panel>
            <Panel value="security" className="h-32 p-4 text-sm">
                Security settings content
            </Panel>
        </Tabs>
    );
}
