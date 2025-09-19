import Name from "./name";

export default function Home() {
    return (
        <main className="flex min-h-full flex-col items-center justify-center gap-6">
            <Name />
            <div>Entrer votre nom 📝</div>
            <div className="rounded-full bg-amber-400 px-3 py-0.5 font-bold text-white">TEST</div>
        </main>
    );
}
