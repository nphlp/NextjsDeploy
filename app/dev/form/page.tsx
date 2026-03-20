import Card from "@atoms/card";
import Main from "@core/Main";
import type { Metadata } from "next";
import FormContact from "./_components/form-contact";
import FormLogin from "./_components/form-login";
import FormOtp from "./_components/form-otp";
import FormRegister from "./_components/form-register";

export const metadata: Metadata = {
    title: "Form",
    description: "Form adapters showcase — login, register, contact, OTP.",
};

export default async function Page() {
    return (
        <Main vertical="start" horizontal="stretch">
            <h1 className="text-2xl font-bold">Form Adapters</h1>
            <p className="text-gray-600">Each form showcases different useForm features and form adapters.</p>

            <div className="columns-1 gap-6 space-y-6 lg:columns-2">
                {/* Login — email progressive, password, checkbox */}
                <Card className="break-inside-avoid">
                    <h2 className="text-lg font-semibold">Login</h2>
                    <p className="text-sm text-gray-500">FormInput, FormInputPassword, FormCheckbox</p>
                    <FormLogin />
                </Card>

                {/* Register — password match, CGV required checkbox */}
                <Card className="break-inside-avoid">
                    <h2 className="text-lg font-semibold">Register</h2>
                    <p className="text-sm text-gray-500">FormInputPassword (match), FormCheckbox (required CGV)</p>
                    <FormRegister />
                </Card>

                {/* Contact — select, combobox, switch, textarea */}
                <Card className="break-inside-avoid">
                    <h2 className="text-lg font-semibold">Contact</h2>
                    <p className="text-sm text-gray-500">FormSelect, FormCombobox, FormSwitch, FormTextArea</p>
                    <FormContact />
                </Card>

                {/* OTP — input OTP */}
                <Card className="break-inside-avoid">
                    <h2 className="text-lg font-semibold">OTP Verification</h2>
                    <p className="text-sm text-gray-500">FormInputOtp</p>
                    <FormOtp />
                </Card>
            </div>
        </Main>
    );
}
