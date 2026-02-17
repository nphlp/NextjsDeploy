import { Link } from "@atoms/button";
import Card from "@atoms/card";
import Main from "@core/Main";
import { devLinks } from "./_config/links";

export default function Page() {
    return (
        <Main vertical="start" horizontal="stretch">
            <h1 className="text-3xl font-bold">Developer Hub</h1>
            <p className="text-gray-500">Showcase pages and development tools.</p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {devLinks.map(({ label, description, href, icon: Icon }) => (
                    <Link key={label} href={href} label={label} className="group w-full rounded-lg" noStyle>
                        <Card className="h-full transition-colors group-hover:border-gray-400">
                            <div className="flex items-center gap-3">
                                <Icon className="size-4 text-gray-500" />
                                <h2 className="text-lg font-semibold">{label}</h2>
                            </div>
                            <p className="text-sm text-gray-500">{description}</p>
                        </Card>
                    </Link>
                ))}
            </div>
        </Main>
    );
}
