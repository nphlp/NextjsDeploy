import ButtonSection from "./components/button";
import InputSection from "./components/input";
import PopupSection from "./components/popup";

export default function Page() {
    return (
        <div className="max-w-[500px] space-y-12">
            <ButtonSection className="space-y-4" />
            <InputSection className="space-y-4" />
            <PopupSection className="space-y-4" />
        </div>
    );
}
