import Link from "@comps/atoms/button/link";

export default async function NotFound() {
    return (
        <div className="flex h-full items-center justify-center">
            <div className="max-w-3/4 space-y-4 p-7">
                <h2 className="text-2xl font-bold">Mmm? There is nothing here...</h2>
                <p>Maybe this page does not exist. Please go back home, or try it again later.</p>
                <Link label="Go back Home" href="/" />
            </div>
        </div>
    );
}
