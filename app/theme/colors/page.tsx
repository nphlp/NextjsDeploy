export default function Page() {
    return (
        <div className="space-y-6 p-7">
            <h2 className="mb-2 text-xl font-bold text-gray-900">Colors</h2>
            <div className="border bg-white p-4">
                <div className="grid h-10 grid-cols-2 text-sm *:flex *:items-center *:justify-center *:px-1">
                    <div className="bg-background">Background</div>
                    <div className="bg-foreground text-background">Foreground</div>
                </div>
                <div className="grid h-10 grid-cols-11 text-sm *:flex *:items-center *:justify-center *:px-1">
                    <div className="bg-gray-50">50</div>
                    <div className="bg-gray-100">100</div>
                    <div className="bg-gray-200">200</div>
                    <div className="bg-gray-300">300</div>
                    <div className="bg-gray-400">400</div>
                    <div className="bg-gray-500">500</div>
                    <div className="text-background bg-gray-600">600</div>
                    <div className="text-background bg-gray-700">700</div>
                    <div className="text-background bg-gray-800">800</div>
                    <div className="text-background bg-gray-900">900</div>
                    <div className="text-background bg-gray-950">950</div>
                </div>
            </div>
        </div>
    );
}
