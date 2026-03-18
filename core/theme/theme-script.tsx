import { readFileSync } from "fs";
import { join } from "path";

const themeScript = readFileSync(join(process.cwd(), "public/theme-script.js"), "utf-8");

export default function ThemeScript() {
    return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
