export default function Page() {
    type Task = {
        nom: string;
        status: "fait" | "en cours" | "à faire";
    };

    const value: Task[] = [
        { nom: "Manger", status: "fait" },
        { nom: "Boire", status: "en cours" },
        { nom: "Danser", status: "fait" },
    ];

    return (
        <div className="space-y-4">
            {value.map((item) => (
                <div key={item.nom}>
                    <span className="text-blue-500 underline">{item.nom}</span>
                    <span> - </span>
                    <span className="font-bold">{item.status}</span>
                </div>
            ))}
        </div>
    );
}
