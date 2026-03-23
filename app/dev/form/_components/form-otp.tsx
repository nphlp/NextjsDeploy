"use client";

import { FormInputOtp } from "@atoms/_form/_adapters";
import Form from "@atoms/_form/form";
import { useForm } from "@atoms/_form/use-form";
import { useToast } from "@atoms/toast";
import { timeout } from "@utils/timout";
import { useState } from "react";
import { z } from "zod";

export default function FormOtp() {
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const { register, reset } = useForm({
        code: {
            schema: z.string().length(6, "Le code doit contenir 6 chiffres"),
            onChangeSchema: z.string(),
            setter: (value: string) => value,
            defaultValue: "",
        },
    });

    const handleComplete = async (code: string) => {
        setIsLoading(true);
        await timeout(1000);
        toast.add({ title: "Code vérifié", description: `Code: ${code}`, type: "success" });
        reset();
        setIsLoading(false);
    };

    return (
        <Form register={register} onSubmit={(e) => e.preventDefault()}>
            <FormInputOtp name="code" label="Code OTP" disabled={isLoading} onComplete={handleComplete} />
        </Form>
    );
}
