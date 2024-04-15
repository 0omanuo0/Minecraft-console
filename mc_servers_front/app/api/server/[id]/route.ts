import { getServers, getServer } from "@/lib/get_server_data"

// function get and recive param id
export async function GET(request: Request, { params } :{ params: { id: string } }) {
    const server = await getServer(params.id);
    return new Response(JSON.stringify(server), { status: 200, headers: { 'Content-Type': 'application/json' } });
}