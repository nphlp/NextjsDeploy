"use client";

import { FolderKanban, LayoutDashboard, User } from "lucide-react";
import { Indicator, List, Panel, Root, Tab, TabsProps } from "./atoms";

export default function Tabs(props: TabsProps) {
    const { children, ...otherProps } = props;

    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    return (
        <Root defaultValue="overview" {...otherProps}>
            <List>
                <Tab value="overview">Overview</Tab>
                <Tab value="projects">Projects</Tab>
                <Tab value="account">Account</Tab>
                <Indicator />
            </List>
            <Panel value="overview" className="flex h-32 items-center justify-center">
                <LayoutDashboard className="size-10 stroke-[1.5px] text-gray-300" />
            </Panel>
            <Panel value="projects" className="flex h-32 items-center justify-center">
                <FolderKanban className="size-10 stroke-[1.5px] text-gray-300" />
            </Panel>
            <Panel value="account" className="flex h-32 items-center justify-center">
                <User className="size-10 stroke-[1.5px] text-gray-300" />
            </Panel>
        </Root>
    );
}
