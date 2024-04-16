
export const api_ip = process.env.SERVER_API_IP;

function isFile(file: string) {
    var match = file.match(/\.[^.]+$/);
    return match ? match[0].substring(1) : undefined;
}

export async function GET(request: Request, { params } :{ params: { id: string } }) {
    const { searchParams } = new URL(request.url);
    const queryParams = searchParams.get("f") ? searchParams.get("f") : "";


    // download file from server
    const url = new URL(`${api_ip}/server/${params.id}/download?f=${queryParams}`);

    const res = await fetch(url.toString());
    const data = await res.blob();
    // check if has extension, else add ".zip"
    let filename = queryParams?.split("/").pop();
    if (!isFile(filename!)) filename = `${filename}.zip`;

    console.log("filename", filename);
    return new Response(data, { status: 200, headers: { 
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename=${filename}`
     }});
    
}

