const api_ip = process.env.SERVER_API_IP;

async function renameFile(file: string, newName: string) {
    return fetch(file, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "newName": newName }),
    }).then(response => {
        if (!response.ok) {
            throw new Error("Failed to rename file");
        }
        return response.json();
    });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();
    const { newName } = body;
    const { searchParams } = new URL(request.url);
    const queryParams = searchParams.get("f") ? searchParams.get("f") : "";

    // Construct the rename endpoint URL
    const renameUrl = `${api_ip}/server/${id}/file/rename?f=${queryParams}`;

    try {
        const result = await renameFile(renameUrl, newName);
        return new Response(JSON.stringify(result), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
}
