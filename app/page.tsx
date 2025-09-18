import Name from "./name";

export default function Home() {
    return (
        <main className="flex min-h-full flex-col items-center justify-center gap-6">
            <Name />
            <div>Entrer votre nom 📝</div>
        </main>
    );
}
