
export const api_ip = process.env.SERVER_API_IP;
export async function GET(request: Request, params: { id: string }) {
    const { searchParams } = new URL(request.url);
    const queryParams = searchParams.get("f") ? searchParams.get("f") : "";


    // fetch file from api_ip + /server/[id]/download
    const url = new URL(`${api_ip}/server/${params.id}/download?f=${queryParams}`);
    const response = await fetch(url);
    const file = await response.arrayBuffer(); 
    return new Response(file,
        {
            headers: {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": `attachment; filename="${queryParams}"`
            }
        }
        );
    
}

