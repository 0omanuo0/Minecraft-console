import { createFolder } from "@/lib/pushServerData";

export async function GET(request: Request, { params } :{ params: { id: string } }) {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder") ?? "";
    const path = searchParams.get("path") ?? "";

    const response = await createFolder(params.id, folder, path);
    // return the response and the error

    if (response.error) {
        return new Response(JSON.stringify({ error: response.error }), { status: 500 });
    }
    else {
        return new Response(JSON.stringify(response), { status: 200 });
    }


}