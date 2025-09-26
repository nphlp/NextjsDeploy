"use server";

/**
 * ## Server side logging function
 *
 * **Use this on a mobile device with `make ngrok` to see logs in real time.**
 *
 * This function logs messages into the server console.
 * Useful for debugging mobile devices interactions and events like `touch`, `blur`, `focus`, etc.
 */
export default async function Log(message: string) {
    console.log(message);
}
