"use client";

import { XIcon } from "lucide-react";
import { ReactNode } from "react";
import { Close, Content, Description, Portal, Provider, Root, Title, Viewport } from "./atoms";
import { useToast } from "./utils";

type ToastProviderProps = {
    children?: ReactNode;
};

export default function ToastProvider(props: ToastProviderProps) {
    const { children } = props;

    return (
        <Provider>
            {children}
            <Portal>
                <Viewport>
                    <ToastStack />
                </Viewport>
            </Portal>
        </Provider>
    );
}

const ToastStack = () => {
    const { toasts } = useToast();

    return toasts.map((toast) => (
        <Root key={toast.id} toast={toast}>
            <Content>
                <Title />
                <Description />
                <Close>
                    <XIcon className="size-4" />
                </Close>
            </Content>
        </Root>
    ));
};
