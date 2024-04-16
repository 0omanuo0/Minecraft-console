import { getHostStatus } from "@/lib/get_server_data";

// function get and recive param id
export async function GET(request: Request) {
    const server = await getHostStatus();
    return new Response(JSON.stringify(server), { status: 200, headers: { 'Content-Type': 'application/json' } });
}