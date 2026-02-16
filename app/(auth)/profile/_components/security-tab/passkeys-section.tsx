"use client";

import AlertDialog, {
    Backdrop as AlertBackdrop,
    Close as AlertClose,
    Description as AlertDescription,
    Popup as AlertPopup,
    Portal as AlertPortal,
    Title as AlertTitle,
} from "@atoms/alert-dialog";
import Button from "@atoms/button";
import Collapsible from "@atoms/collapsible";
import { Panel, Trigger } from "@atoms/collapsible/atoms";
import Dialog, {
    Backdrop as DialogBackdrop,
    Close as DialogClose,
    Description as DialogDescription,
    Popup as DialogPopup,
    Portal as DialogPortal,
    Title as DialogTitle,
} from "@atoms/dialog";
import Input from "@atoms/input/input";
import { useToast } from "@atoms/toast";
import { passkey } from "@lib/auth-client";
import dayjs from "dayjs";
import { ChevronRight, Fingerprint, Info, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type PasskeyData = {
    id: string;
    name?: string;
    createdAt: Date;
};

export default function PasskeysSection() {
    const toast = useToast();
    const [passkeys, setPasskeys] = useState<PasskeyData[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [keyName, setKeyName] = useState("");
    const [managerName, setManagerName] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // Fetch passkeys on mount and when refreshKey changes
    const isMounted = useRef(true);
    useEffect(() => {
        isMounted.current = true;
        passkey.listUserPasskeys().then(({ data }) => {
            if (isMounted.current && data) setPasskeys(data);
        });
        return () => {
            isMounted.current = false;
        };
    }, [refreshKey]);

    const handleOpenModal = () => {
        setKeyName("");
        setManagerName("");
        setIsOpen(true);
    };

    const handleAdd = async () => {
        setIsAdding(true);

        // Register passkey with the key name (shown in password manager, defaults to "Clé d'accès")
        const resolvedKeyName = keyName.trim() || "Clé d'accès";
        const { data, error } = await passkey.addPasskey({ name: resolvedKeyName });

        if (error || !data) {
            toast.add({ title: "Erreur", description: "Impossible d'ajouter la clé d'accès.", type: "error" });
            setIsAdding(false);
            return;
        }

        // Update with the manager name (shown in our passkey list on /profile)
        const trimmedManagerName = managerName.trim();
        if (trimmedManagerName) {
            await passkey.updatePasskey({ id: data.id, name: trimmedManagerName });
        }

        toast.add({ title: "Clé d'accès ajoutée", type: "success" });
        setIsAdding(false);
        setIsOpen(false);
        setRefreshKey((k) => k + 1);
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        const { error } = await passkey.deletePasskey({ id: deleteId });

        if (error) {
            toast.add({ title: "Erreur", description: "Impossible de supprimer la clé d'accès.", type: "error" });
            setDeleteId(null);
            return;
        }

        toast.add({ title: "Clé d'accès supprimée", type: "success" });
        setDeleteId(null);
        setRefreshKey((k) => k + 1);
    };

    return (
        <section className="space-y-3">
            {/* Header */}
            <div>
                <p className="font-medium">Clés d&apos;accès (Passkeys)</p>
                <p className="text-sm text-gray-600">
                    Une clé d&apos;accès vous permet de vous connecter en un clic, sans mot de passe ni code 2FA.
                </p>
            </div>

            {/* Tip */}
            <div className="flex gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs text-blue-800">
                <Info className="mt-0.5 size-3.5 shrink-0" />
                <p>
                    Pour ajouter une clé d&apos;accès, votre gestionnaire de mots de passe doit être déverrouillé.
                    Sinon, c&apos;est votre navigateur qui la demandera. Si vous refusez, ce sera le système
                    d&apos;exploitation.
                </p>
            </div>

            {/* Learn more */}
            <Collapsible>
                <Trigger>
                    <ChevronRight className="size-3 transition-all ease-out group-data-panel-open:rotate-90" />
                    En savoir plus
                </Trigger>
                <Panel>
                    <div className="mt-2 space-y-4 rounded-lg border border-gray-200 bg-gray-50/50 p-4 text-xs text-gray-600">
                        {/* How it works */}
                        <div className="space-y-1">
                            <p className="font-medium text-gray-900">Comment ça marche ?</p>
                            <p>
                                Votre clé d&apos;accès est stockée dans un gestionnaire de mots de passe, dans votre
                                navigateur, ou directement sur votre appareil. Sur la page de connexion, cliquez sur
                                &quot;Clé d&apos;accès&quot; et vous êtes authentifié automatiquement.
                            </p>
                        </div>

                        {/* Is it secure */}
                        <div className="space-y-1">
                            <p className="font-medium text-gray-900">C&apos;est sécurisé ?</p>
                            <p>
                                C&apos;est aussi sécurisé que le système classique : email + mot de passe + double
                                authentification. L&apos;avantage est que la connexion se fait en 1 clic, 1 étape. Pas
                                de mot de passe supplémentaire à retenir, pas de code 2FA à saisir.
                            </p>
                            <p>
                                Il est recommandé d&apos;avoir un mot de passe principal solide sur votre{" "}
                                <span className="font-medium">gestionnaire de mots de passe</span> ou votre{" "}
                                <span className="font-medium">session</span>. N&apos;utilisez les clés d&apos;accès que
                                sur des appareils personnels et sécurisés, jamais sur des ordinateurs publics ou
                                partagés.
                            </p>
                        </div>

                        {/* Where is the key stored */}
                        <div className="space-y-2">
                            <p className="font-medium text-gray-900">Où est stockée la clé ?</p>
                            <p>
                                La clé peut être stockée à différents endroits. Selon votre choix, elle pourra être
                                synchronisée ou non entre vos différents appareils.
                            </p>

                            <ul className="list-disc space-y-2 pl-4">
                                <li>
                                    <span className="font-medium text-gray-800">Gestionnaire de mots de passe</span>
                                    <br />
                                    La clé est synchronisée sur tous vos appareils, indépendamment du navigateur ou du
                                    système d&apos;exploitation. C&apos;est la solution la plus flexible.
                                    <br />
                                    <span className="text-gray-500">
                                        Ex : Proton Pass (open source), Bitwarden (open source), Dashlane, 1Password
                                    </span>
                                </li>
                                <li>
                                    <span className="font-medium text-gray-800">Navigateur</span>
                                    <br />
                                    La clé est synchronisée entre les appareils connectés au même compte navigateur.
                                    Vous dépendez de l&apos;écosystème du navigateur.
                                    <br />
                                    <span className="text-gray-500">
                                        Ex : Firefox (open source), Brave (open source), Chrome (via compte Google),
                                        Safari (via iCloud)
                                    </span>
                                </li>
                                <li>
                                    <span className="font-medium text-gray-800">Appareil</span>
                                    <br />
                                    La clé est stockée localement ou synchronisée via le compte de l&apos;écosystème
                                    (iCloud, Google, Microsoft).
                                    <br />
                                    <span className="text-gray-500">
                                        Ex : Touch ID / Face ID (Mac, iPhone via iCloud), Windows Hello, Android (via
                                        Google Password Manager)
                                    </span>
                                </li>
                                <li>
                                    <span className="font-medium text-gray-800">Clé physique (FIDO)</span>
                                    <br />
                                    La clé est stockée sur le matériel uniquement. Aucune synchronisation possible. Si
                                    vous perdez la clé, vous perdez l&apos;accès.
                                    <br />
                                    <span className="text-gray-500">
                                        Ex : YubiKey, SoloKeys (open source), Nitrokey (open source)
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Reference link */}
                        <p className="text-gray-500">
                            En savoir plus :{" "}
                            <a
                                href="https://proton.me/fr/blog/what-is-a-passkey"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                            >
                                Qu&apos;est-ce qu&apos;une clé d&apos;accès ? — Proton (FR)
                            </a>
                            {" | "}
                            <a
                                href="https://proton.me/blog/what-is-a-passkey"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                            >
                                EN
                            </a>
                        </p>
                    </div>
                </Panel>
            </Collapsible>

            {/* Passkey list */}
            {passkeys.length > 0 && (
                <div className="space-y-2">
                    {passkeys.map((pk) => (
                        <div
                            key={pk.id}
                            className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3"
                        >
                            <div className="flex items-center gap-3">
                                <Fingerprint className="size-5 text-gray-500" />
                                <div>
                                    <p className="text-sm font-medium">{pk.name ?? "Clé d'accès"}</p>
                                    <p className="text-xs text-gray-500">
                                        Ajouté le {dayjs(pk.createdAt).format("DD/MM/YYYY à HH:mm")}
                                    </p>
                                </div>
                            </div>
                            <Button
                                label="Supprimer la clé d'accès"
                                onClick={() => setDeleteId(pk.id)}
                                colors="ghost"
                                noStyle
                                className="text-gray-400 hover:text-red-600"
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add passkey */}
            <Button label="Ajouter une clé d'accès" onClick={handleOpenModal} colors="outline">
                <Fingerprint className="size-4" />
                Ajouter une clé d&apos;accès
            </Button>

            {/* Add passkey modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogPortal>
                    <DialogBackdrop />
                    <DialogPopup>
                        <div className="flex items-center gap-3">
                            <Fingerprint className="size-5 text-gray-500" />
                            <DialogTitle>Ajouter une clé d&apos;accès</DialogTitle>
                        </div>
                        <DialogDescription>
                            Configurez le nom de votre clé d&apos;accès pour votre gestionnaire et pour ce site.
                        </DialogDescription>

                        <div className="mt-4 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Nom de la clé <span className="font-normal text-gray-400">— facultatif</span>
                                </label>
                                <Input
                                    placeholder="Clé d'accès, Passkeys..."
                                    value={keyName}
                                    setValue={setKeyName}
                                    autoFocus
                                />
                                <p className="text-xs text-gray-500">
                                    C&apos;est le nom attribué à la clé dans votre gestionnaire de mots de passe (Proton
                                    Pass, Chrome, etc.). Par défaut : &quot;Clé d&apos;accès&quot;.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Nom du gestionnaire <span className="font-normal text-gray-400">— facultatif</span>
                                </label>
                                <Input
                                    placeholder="Ex : Proton Pass, MacBook Air, YubiKey..."
                                    value={managerName}
                                    setValue={setManagerName}
                                    legacyProps={{
                                        onKeyDown: (e) => {
                                            if (e.key === "Enter") handleAdd();
                                        },
                                    }}
                                />
                                <p className="text-xs text-gray-500">
                                    C&apos;est le nom attribué à cette clé sur cette page (/profile) pour la
                                    différencier des autres clés si vous en avez plusieurs.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <DialogClose>Annuler</DialogClose>
                            <Button label="Ajouter la clé" onClick={handleAdd} loading={isAdding}>
                                Ajouter la clé
                            </Button>
                        </div>
                    </DialogPopup>
                </DialogPortal>
            </Dialog>

            {/* Delete passkey alert */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertPortal>
                    <AlertBackdrop />
                    <AlertPopup>
                        <AlertTitle className="flex items-center gap-3">
                            <Fingerprint className="size-5 text-gray-500" />
                            Supprimer la clé d&apos;accès
                        </AlertTitle>
                        <AlertDescription className="text-sm">
                            Cette action est irréversible. Vous ne pourrez plus vous connecter avec cette clé
                            d&apos;accès.
                        </AlertDescription>
                        <div className="flex justify-end gap-4">
                            <AlertClose>Annuler</AlertClose>
                            <Button label="Supprimer" colors="destructive" onClick={handleDelete}>
                                Supprimer
                            </Button>
                        </div>
                    </AlertPopup>
                </AlertPortal>
            </AlertDialog>
        </section>
    );
}
