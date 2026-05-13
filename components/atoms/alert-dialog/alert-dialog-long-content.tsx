"use client";

import {
    AlertDialogProps,
    Backdrop,
    Close,
    Content,
    Description,
    Footer,
    Header,
    Popup,
    Portal,
    Root,
    Title,
    Trigger,
} from "./atoms";

/**
 * Demo: AlertDialog with a long, scrollable Content (e.g. Terms of Service
 * before a destructive confirm). Same Header / Content / Footer anatomy as
 * the default `AlertDialog` — only the body length differs.
 */
export default function AlertDialogLongContent(props: AlertDialogProps) {
    const { children, ...otherProps } = props;

    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    return (
        <Root {...otherProps}>
            <Trigger colors="destructive">Delete account</Trigger>
            <Portal>
                <Backdrop />
                <Popup>
                    <Header>
                        <Title>Delete your account?</Title>
                        <Description>
                            This will permanently remove your data. Read carefully before confirming.
                        </Description>
                    </Header>
                    <Content>
                        <p className="text-sm text-gray-700">
                            All workspaces, playlists and custom algorithms tied to this account will be deleted. We
                            keep anonymous aggregate metrics for billing purposes only.
                        </p>
                        <p className="text-sm font-semibold text-gray-900">Terms of Service excerpt</p>
                        <p className="text-sm text-gray-700">
                            1. Deletion is irreversible. Once you confirm, your data is removed from our primary
                            database and queued for deletion in our backup snapshots within 30 days.
                        </p>
                        <p className="text-sm text-gray-700">
                            2. Any active subscription is cancelled immediately. You will not be billed for the
                            remaining period and no proration is issued.
                        </p>
                        <p className="text-sm text-gray-700">
                            3. Shared resources (public algorithms you authored, comments on community puzzles) remain
                            visible but become attributed to a tombstoned anonymous identity.
                        </p>
                        <p className="text-sm text-gray-700">
                            4. We retain your email address for 90 days in a separate audit log to comply with
                            anti-fraud requirements. After that window the email is hashed and the original is purged.
                        </p>
                        <p className="text-sm text-gray-700">
                            5. You may request a copy of all your data before confirming deletion via the &quot;Export
                            data&quot; entry in your account settings. The export is generated in JSON within minutes
                            and emailed as a download link valid for 24 hours.
                        </p>
                        <p className="text-sm text-gray-700">
                            6. Re-creating an account with the same email after deletion is allowed but starts from an
                            empty state — there is no resurrection of past data.
                        </p>
                        <p className="text-sm text-gray-700">
                            7. By proceeding you confirm that you have read these terms and accept that the action
                            cannot be undone by support staff. Header + Footer stay sticky so the destructive action is
                            always reachable without losing the title.
                        </p>
                    </Content>
                    <Footer>
                        <Close>Cancel</Close>
                        <Close colors="destructive">Delete</Close>
                    </Footer>
                </Popup>
            </Portal>
        </Root>
    );
}
