import Link from "@comps/atoms/button/link";
import Main from "@core/Main";

export default async function NotFound() {
    return (
        <Main>
            <div className="w-full max-w-150 space-y-4">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Mmm? There is nothing here...</h2>
                    <p>Maybe this page does not exist. Please go back home, or try it again later.</p>
                </div>
                <div className="flex justify-center">
                    <Link label="Go back Home" href="/" />
                </div>
            </div>
        </Main>
    );
}
