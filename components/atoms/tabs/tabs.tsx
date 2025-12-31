"use client";

import { ReactNode } from "react";
import { Indicator, List, Panel, Root, Tab } from "./atoms";

type TabsProps = {
    children?: ReactNode;
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
};

export default function Tabs(props: TabsProps) {
    const { children, defaultValue, value, onValueChange, className } = props;

    if (children)
        return (
            <Root defaultValue={defaultValue} value={value} onValueChange={onValueChange} className={className}>
                {children}
            </Root>
        );

    return (
        <Root defaultValue="tab1" className={className}>
            <List>
                <Tab value="tab1">Overview</Tab>
                <Tab value="tab2">Projects</Tab>
                <Tab value="tab3">Account</Tab>
                <Indicator />
            </List>
            <Panel value="tab1">Contenu de l&apos;onglet Overview</Panel>
            <Panel value="tab2">Contenu de l&apos;onglet Projects</Panel>
            <Panel value="tab3">Contenu de l&apos;onglet Account</Panel>
        </Root>
    );
}
