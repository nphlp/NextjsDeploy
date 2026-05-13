"use client";

import Button from "@atoms/button";
import {
    Backdrop,
    Close,
    Content,
    Description,
    DialogProps,
    Footer,
    Header,
    Popup,
    Portal,
    Root,
    Title,
    Trigger,
} from "./atoms";

/**
 * Demo: Dialog with a long, scrollable Content. Same Header / Content /
 * Footer anatomy as the default `Dialog` — only the body length differs,
 * which makes the sticky header / footer behavior obvious as you scroll.
 */
export default function DialogLongContent(props: DialogProps) {
    const { children, ...otherProps } = props;

    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    return (
        <Root {...otherProps}>
            <Trigger>Edit profile</Trigger>
            <Portal>
                <Backdrop />
                <Popup>
                    <Header>
                        <Title>Edit profile</Title>
                        <Description>Update your name and bio. Click save when you&apos;re done.</Description>
                    </Header>
                    <Content>
                        <p className="text-sm text-gray-700">
                            This region scrolls when its content overflows the popup&apos;s vertical cap. The header and
                            footer above and below stay sticky while the body slides under them.
                        </p>
                        <p className="text-sm text-gray-700">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent fermentum massa eget risus
                            tempor, vitae luctus ipsum porttitor. Donec at lectus eu nulla pulvinar varius.
                        </p>
                        <p className="text-sm text-gray-700">
                            Sed accumsan, lacus quis tincidunt commodo, magna nibh facilisis nisl, nec elementum dui
                            justo a urna. Curabitur ac arcu eget mi vehicula consequat. Integer nec arcu nec nibh
                            volutpat egestas vitae nec mauris.
                        </p>
                        <p className="text-sm text-gray-700">
                            Vivamus aliquam, mi at vulputate ultricies, sapien sapien gravida sapien, eget pulvinar nibh
                            ipsum non turpis. Suspendisse potenti. Aliquam erat volutpat.
                        </p>
                        <p className="text-sm text-gray-700">
                            Nulla facilisi. Phasellus ac justo a libero efficitur fermentum. Cras congue, justo at
                            faucibus tristique, urna lectus pellentesque enim, sit amet vehicula erat libero quis dui.
                        </p>
                        <p className="text-sm text-gray-700">
                            Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo
                            magna eros quis urna. Nunc viverra imperdiet enim.
                        </p>
                        <p className="text-sm text-gray-700">
                            Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante,
                            dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius
                            laoreet.
                        </p>
                        <p className="text-sm text-gray-700">
                            Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper
                            ultricies nisi. Nam eget dui. Etiam rhoncus.
                        </p>
                    </Content>
                    <Footer>
                        <Close>Cancel</Close>
                        <Button label="Save" colors="primary">
                            Save
                        </Button>
                    </Footer>
                </Popup>
            </Portal>
        </Root>
    );
}
