"use client";

import { FolderKanban, LayoutDashboard, User } from "lucide-react";
import { Indicator, List, Panel, Root, Tab, TabsProps } from "./atoms";

export default function TabsVertical(props: TabsProps) {
    const { children, ...otherProps } = props;

    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    return (
        <Root defaultValue="overview" className="flex-row" {...otherProps}>
            <List className="flex-col px-0 py-1 shadow-[inset_-1px_0] shadow-gray-200">
                <Tab value="overview">Overview</Tab>
                <Tab value="projects">Projects</Tab>
                <Tab value="account">Account</Tab>
                <Indicator className="top-0 left-0 h-(--active-tab-height) w-(--active-tab-width) translate-x-0 translate-y-(--active-tab-top)" />
            </List>
            <Panel value="overview" className="flex h-32 flex-1 items-center justify-center">
                <LayoutDashboard className="size-10 stroke-[1.5px] text-gray-300" />
            </Panel>
            <Panel value="projects" className="flex h-32 flex-1 items-center justify-center">
                <FolderKanban className="size-10 stroke-[1.5px] text-gray-300" />
            </Panel>
            <Panel value="account" className="flex h-32 flex-1 items-center justify-center">
                <User className="size-10 stroke-[1.5px] text-gray-300" />
            </Panel>
        </Root>
    );
}
