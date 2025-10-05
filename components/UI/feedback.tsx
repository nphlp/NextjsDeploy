"use client";

import { combo } from "@lib/combo";
import { CircleAlert, CircleCheck, CircleHelp, CircleX } from "lucide-react";
import { motion } from "motion/react";

export type FeedbackMode = "success" | "info" | "warning" | "error";

export type FeedbackType =
    | {
          message: string;
          mode: FeedbackMode;
      }
    | undefined;

type FeedbackProps = {
    feedback: FeedbackType;
    isFeedbackOpen: boolean;
};

export default function Feedback(props: FeedbackProps) {
    const { feedback = { message: "", mode: "success" }, isFeedbackOpen } = props;
    const { message, mode } = feedback;

    const modeStyle = {
        success: {
            class: combo("text-green-700 border-green-500 bg-green-100"),
            icon: <CircleCheck className="size-4" />,
        },
        info: {
            class: combo("text-blue-700 border-blue-500 bg-blue-100"),
            icon: <CircleHelp className="size-4" />,
        },
        warning: {
            class: combo("text-orange-700 border-orange-500 bg-orange-100"),
            icon: <CircleAlert className="size-4" />,
        },
        error: {
            class: combo("text-red-700 border-red-500 bg-red-100"),
            icon: <CircleX className="size-4" />,
        },
    };

    return (
        <motion.div
            initial={{
                height: "0px",
            }}
            animate={{
                height: isFeedbackOpen ? "auto" : "0px",
            }}
            transition={{ duration: 0.3 }}
            className={combo("flex w-full justify-center overflow-hidden")}
        >
            <div className={combo("rounded-xl border text-xs text-wrap", modeStyle[mode].class)}>
                <div className={combo("flex items-center justify-center gap-2 px-5 py-2")}>
                    {modeStyle[mode].icon}
                    <span>{message}</span>
                </div>
            </div>
        </motion.div>
    );
}
