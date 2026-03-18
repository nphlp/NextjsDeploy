"use client";

import { Plus } from "lucide-react";
import { AccordionProps, Header, Item, Panel, Root, Trigger } from "./atoms";

export default function Accordion(props: AccordionProps) {
    const { children, ...otherProps } = props;

    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    return (
        <Root {...otherProps}>
            <Item>
                <Header>
                    <Trigger>
                        What is Base UI?
                        <Plus className="mr-2 size-3 shrink-0 transition-all ease-out group-data-panel-open:scale-110 group-data-panel-open:rotate-45" />
                    </Trigger>
                </Header>
                <Panel>
                    <div className="p-3">
                        Base UI is a library of high-quality unstyled React components for design systems and web apps.
                    </div>
                </Panel>
            </Item>

            <Item>
                <Header>
                    <Trigger>
                        How do I get started?
                        <Plus className="mr-2 size-3 shrink-0 transition-all ease-out group-data-panel-open:scale-110 group-data-panel-open:rotate-45" />
                    </Trigger>
                </Header>
                <Panel>
                    <div className="p-3">
                        Head to the &quot;Quick start&quot; guide in the docs. If you&apos;ve used unstyled libraries
                        before, you&apos;ll feel at home.
                    </div>
                </Panel>
            </Item>

            <Item>
                <Header>
                    <Trigger>
                        Can I use it for my project?
                        <Plus className="mr-2 size-3 shrink-0 transition-all ease-out group-data-panel-open:scale-110 group-data-panel-open:rotate-45" />
                    </Trigger>
                </Header>
                <Panel>
                    <div className="p-3">Of course! Base UI is free and open source.</div>
                </Panel>
            </Item>
        </Root>
    );
}
