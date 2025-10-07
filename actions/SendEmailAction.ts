"use server";

type SendEmailActionProps = {
    subject: string;
    email: string;
    buttonUrl: string;
};

export default async function SendEmailAction(props: SendEmailActionProps) {
    console.error("SendEmailAction not implemented !");
    return props;
}
