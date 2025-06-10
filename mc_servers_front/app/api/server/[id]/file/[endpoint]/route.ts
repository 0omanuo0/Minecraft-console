

const api_ip = process.env.SERVER_API_IP;
export async function POST(request: Request, { params }: { params: Promise<{ id: string, endpoint: string }> }) {

    const { id, endpoint } = await params;
    const { searchParams } = new URL(request.url);
    const queryParams = searchParams.get("f") ? searchParams.get("f") : "";
    const formData = await request.json();

    console.log("Fetching data from:", `${api_ip}/server/${id}/${endpoint}?f=${queryParams}`);

    // send the data to api_ip + /server/[id]/download
    const url = new URL(`${api_ip}/server/${id}/file/${endpoint}?f=${queryParams}`);
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ formData })
    });

    if (!response.ok) {
        return new Response(JSON.stringify({ error: 'Failed to fetch data from API' }), {
            headers: { 'Content-Type': 'application/json' },
            status: response.status,
        });
    }
    const data = await response.json();
    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
    });


}

