"use client";

import { Accordion, AccordionButton, AccordionContent } from "@comps/UI/accordion";
import Button from "@comps/UI/button/button";
import Feedback, { FeedbackType } from "@comps/UI/feedback";
import Input from "@comps/UI/input/input";
import InputPassword from "@comps/UI/inputPassword";
import { changePassword, updateUser, useSession } from "@lib/authClient";
import { Session } from "@lib/authServer";
import { useState } from "react";
import { UpdateLastnameAction } from "@/actions/UpdateLastnameAction";

type EditionAccordionProps = {
    session: NonNullable<Session>;
    index?: number;
};

export default function EditionAccordion(props: EditionAccordionProps) {
    const { session: serverSession } = props;
    const { data: clientSession } = useSession();

    // SSR session
    const session = clientSession ?? serverSession;

    return (
        <Accordion>
            <AccordionButton>
                <div className="text-lg font-bold">Edition</div>
                <div className="text-gray-middle text-xs">Modifier vos données personnelles.</div>
            </AccordionButton>
            <AccordionContent>
                <div className="space-y-4">
                    <UpdateLastnameForm session={session} />
                    <UpdateFirstnameForm session={session} />
                    {/* <UpdateEmailForm session={session} /> */}
                    <UpdatePasswordForm />
                </div>
            </AccordionContent>
        </Accordion>
    );
}

type UpdateFormProps = {
    session: NonNullable<Session>;
};

const UpdateLastnameForm = (props: UpdateFormProps) => {
    const { session } = props;

    const [lastname, setLastname] = useState("");
    const [placeholder, setPlaceholder] = useState(session.user.lastname ?? "");
    const [isLoading, setIsLoading] = useState(false);

    const handleNameUpdate = async (e: React.FormEvent) => {
        // Prevent refresh and check if data exists
        e.preventDefault();
        if (!lastname) return;

        // Set loading state
        setIsLoading(true);

        // Update database
        const updateResponse = await UpdateLastnameAction({ lastname });
        if (!updateResponse) console.error("Erreur lors de la modification du nom");
        setPlaceholder(lastname);

        // Reset form and stop loading
        setLastname("");
        setIsLoading(false);
    };

    return (
        <div>
            <h2 className="text-gray-middle text-sm font-bold">Modifier mon nom</h2>
            <hr className="mt-1 mb-3" />
            <form onSubmit={handleNameUpdate} className="flex flex-col items-center gap-2">
                <Input
                    label="Nom"
                    placeholder={placeholder}
                    setValue={setLastname}
                    value={lastname}
                    required={false}
                    autoComplete="family-name"
                    className={{ component: "w-full" }}
                    noLabel
                />
                <Button
                    label="Valider"
                    isLoading={isLoading}
                    type="submit"
                    className={{ button: "px-3 py-1", text: "text-sm" }}
                />
            </form>
        </div>
    );
};

const UpdateFirstnameForm = (props: UpdateFormProps) => {
    const { session } = props;

    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleNameUpdate = async (e: React.FormEvent) => {
        // Prevent refresh and check if data exists
        e.preventDefault();
        if (!name) return;

        // Set loading state
        setIsLoading(true);

        // Update database through Better Auth API
        try {
            await updateUser({ name });
        } catch {
            console.error("Erreur lors de la modification du prénom");
        }

        // Reset form and stop loading
        setName("");
        setIsLoading(false);
    };

    return (
        <div>
            <h2 className="text-gray-middle text-sm font-bold">Modifier mon prénom</h2>
            <hr className="mt-1 mb-3" />
            <form onSubmit={handleNameUpdate} className="flex flex-col items-center gap-2">
                <Input
                    label="Prénom"
                    placeholder={session.user.name}
                    setValue={setName}
                    value={name}
                    required={false}
                    autoComplete="given-name"
                    className={{ component: "w-full" }}
                    noLabel
                />
                <Button
                    label="Valider"
                    isLoading={isLoading}
                    type="submit"
                    className={{ button: "px-3 py-1", text: "text-sm" }}
                />
            </form>
        </div>
    );
};

// const UpdateEmailForm = (props: UpdateFormProps) => {
//     const { session } = props;

//     const [email, setEmail] = useState("");
//     const [isLoading, setIsLoading] = useState(false);

//     const handleEmailUpdate = async (e: React.FormEvent) => {
//         // Prevent refresh and check if data exists
//         e.preventDefault();
//         if (!email) return;

//         // Set loading state
//         setIsLoading(true);

//         // Update database through Better Auth API
//         try {
//             await changeEmail({ newEmail: email, callbackURL: "/profile" });
//         } catch {
//             console.error("Erreur lors de la modification de l'email");
//         }

//         // Reset form and stop loading
//         setEmail("");
//         setIsLoading(false);
//     };

//     return (
//         <div>
//             <h2 className="text-gray-middle text-sm font-bold">Modifier mon email</h2>
//             <hr className="mt-1 mb-3" />
//             <form onSubmit={handleEmailUpdate} className="flex flex-col items-center gap-2">
//                 <Input
//                     label="Email"
//                     placeholder={session.user.email}
//                     setValue={setEmail}
//                     value={email}
//                     required={false}
//                     autoComplete="email"
//                     className={{ component: "w-full" }}
//                     noLabel
//                 />
//                 <Button
//                     label="Valider"
//                     isLoading={isLoading}
//                     type="submit"
//                     className={{ button: "px-3 py-1", text: "text-sm" }}
//                 />
//             </form>
//         </div>
//     );
// };

const UpdatePasswordForm = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [feedback, setFeedback] = useState<FeedbackType>();
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        // Prevent refresh and check if data exists
        e.preventDefault();
        if (!currentPassword || !newPassword) return;

        // Set loading state
        setIsLoading(true);
        setIsFeedbackOpen(false);

        // Update database through Better Auth API
        const { data } = await changePassword({ currentPassword, newPassword, revokeOtherSessions: true });

        if (!data) {
            setFeedback({ message: "Failed to change password, current password could be incorrect.", mode: "error" });
            setIsFeedbackOpen(true);
            setIsLoading(false);
            return;
        }

        // Reset form and stop loading
        setFeedback({ message: "Password changed successfully.", mode: "success" });
        setIsFeedbackOpen(true);
        setCurrentPassword("");
        setNewPassword("");
        setIsLoading(false);
    };

    return (
        <div>
            <h2 className="text-gray-middle text-sm font-bold">Modifier mon mot de passe</h2>
            <hr className="mt-1 mb-3" />
            <form onSubmit={handlePasswordUpdate} className="flex flex-col items-center gap-4">
                <InputPassword
                    label="Mot de passe actuel"
                    placeholder="Mot de passe actuel"
                    setValue={setCurrentPassword}
                    value={currentPassword}
                    autoComplete="current-password"
                    className={{ component: "w-full" }}
                    noLabel
                />
                <InputPassword
                    label="Nouveau mot de passe"
                    placeholder="Nouveau mot de passe"
                    setValue={setNewPassword}
                    value={newPassword}
                    autoComplete="new-password"
                    className={{ component: "w-full" }}
                    noLabel
                />
                <Feedback isFeedbackOpen={isFeedbackOpen} feedback={feedback} />
                <Button
                    label="Valider"
                    isLoading={isLoading}
                    type="submit"
                    className={{ button: "px-3 py-1", text: "text-sm" }}
                />
            </form>
        </div>
    );
};
