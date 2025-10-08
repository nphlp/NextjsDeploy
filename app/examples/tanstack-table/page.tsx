import { TanstackTable } from "./components/tanstack-table";

export type Payment = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
};

export default function Page() {
    const data: Payment[] = [
        {
            id: "m5gr84i9",
            amount: 316,
            status: "success",
            email: "ken99@example.com",
        },
        {
            id: "3u1reuv4",
            amount: 242,
            status: "success",
            email: "Abe45@example.com",
        },
        {
            id: "derv1ws0",
            amount: 837,
            status: "processing",
            email: "Monserrat44@example.com",
        },
        {
            id: "5kma53ae",
            amount: 874,
            status: "success",
            email: "Silas22@example.com",
        },
        {
            id: "bhqecj4p",
            amount: 721,
            status: "failed",
            email: "carmella@example.com",
        },
        {
            id: "m5gr84i9",
            amount: 489,
            status: "success",
            email: "ken99@example.com",
        },
        {
            id: "3u1reuv4",
            amount: 284,
            status: "success",
            email: "Abe45@example.com",
        },
        {
            id: "derv1ws0",
            amount: 878,
            status: "processing",
            email: "Monserrat44@example.com",
        },
        {
            id: "5kma53ae",
            amount: 347,
            status: "success",
            email: "Silas22@example.com",
        },
    ];

    return (
        <div className="p-7">
            <TanstackTable data={data} />
        </div>
    );
}
