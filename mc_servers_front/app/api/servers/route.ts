import { getServers } from "@/lib/get_server_data"

export  async function GET(request: Request) {
    const servers = await getServers();
    if (servers === undefined) {
        return new Response(JSON.stringify({ error: "Failed to fetch servers" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    if (servers === null) {
        return new Response(JSON.stringify({ error: "No servers found" }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify(servers), { status: 200, headers: { 'Content-Type': 'application/json' } });
}