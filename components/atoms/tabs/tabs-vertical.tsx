"use client";

import { FolderKanban, LayoutDashboard, User } from "lucide-react";
import { Indicator, List, Panel, Root, Tab, TabsProps } from "./atoms";

export default function TabsVertical(props: TabsProps) {
    const { children, ...otherProps } = props;

    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    return (
        <Root defaultValue="overview" orientation="vertical" className="flex h-42 flex-row" {...otherProps}>
            <List className="flex-col border-r border-b-0 border-gray-200">
                <Tab value="overview">Overview</Tab>
                <Tab value="projects">Projects</Tab>
                <Tab value="account">Account</Tab>
                <Indicator className="top-0 left-1 translate-x-0 translate-y-(--active-tab-top)" />
            </List>
            <div className="min-w-48 flex-1">
                <Panel value="overview" className="flex h-full items-center justify-center">
                    <LayoutDashboard className="size-10 stroke-[1.5px] text-gray-300" />
                </Panel>
                <Panel value="projects" className="flex h-full items-center justify-center">
                    <FolderKanban className="size-10 stroke-[1.5px] text-gray-300" />
                </Panel>
                <Panel value="account" className="flex h-full items-center justify-center">
                    <User className="size-10 stroke-[1.5px] text-gray-300" />
                </Panel>
            </div>
        </Root>
    );
}
