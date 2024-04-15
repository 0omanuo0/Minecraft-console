import { getServers } from "@/lib/get_server_data"

export  async function GET(request: Request) {
    const servers = await getServers();
    return new Response(JSON.stringify(servers), { status: 200, headers: { 'Content-Type': 'application/json' } });
}