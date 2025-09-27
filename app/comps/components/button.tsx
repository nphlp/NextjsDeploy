import Button from "@comps/UI/button/button";
import { ButtonVariant, styles as buttonStyles } from "@comps/UI/button/theme";

type ButtonSectionProps = {
    className?: string;
};

export default function ButtonSection(props: ButtonSectionProps) {
    const { className } = props;

    const variants = Object.keys(buttonStyles) as ButtonVariant[];

    const firstLetterUppercase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <section className={className}>
            <h2 className="border-gray-middle border-b pb-2 text-2xl font-bold">Buttons and Links</h2>
            {variants.map((variant, index) => (
                <div className="grid grid-cols-3 gap-x-4" key={index}>
                    <div className="text-gray-high col-span-3 py-2 font-bold">{firstLetterUppercase(variant)}</div>
                    <Button label="Button black" variant={variant} className={{ button: "w-full" }} />
                    <Button label="Loading" variant={variant} className={{ button: "w-full" }} isLoading />
                    <Button label="Disabled" variant={variant} className={{ button: "w-full" }} isDisabled />
                </div>
            ))}
        </section>
    );
}
