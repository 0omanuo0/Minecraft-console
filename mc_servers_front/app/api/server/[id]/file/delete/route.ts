
const api_ip = process.env.SERVER_API_IP;
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const queryParams = searchParams.get("f") ? searchParams.get("f") : "";


    // fetch file from api_ip + /server/[id]/download
    const url = new URL(`${api_ip}/server/${id}/file/delete?f=${queryParams}`);
    console.log("Fetching file from:", url.toString());
    const response = await fetch(url,
        {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
    );
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

