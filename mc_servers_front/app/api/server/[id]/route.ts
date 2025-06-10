import { getServers, getServer } from "@/lib/get_server_data"

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    // await the promise that resolves to an object with `id`
    const { id } = await context.params;
    const server = await getServer(id);
    return new Response(
        JSON.stringify(server),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
}
