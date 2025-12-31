import Link from "@comps/atoms/button/link";
import Main from "@core/Main";

export default async function Unauthorized() {
    return (
        <Main>
            <div className="w-full max-w-150 space-y-4">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Mmm. You&apos;re not authorized</h2>
                    <p>Please login with an authorized account before accessing this page.</p>
                </div>
                <div className="flex justify-center">
                    <Link label="Go back Home" href="/" />
                </div>
            </div>
        </Main>
    );
}
