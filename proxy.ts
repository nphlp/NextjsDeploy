import { NextRequest } from "next/server";
import csrfProtection from "./api/csrf";

export default async function proxy(request: NextRequest) {
    const response = await csrfProtection(request);

    return response;
}
