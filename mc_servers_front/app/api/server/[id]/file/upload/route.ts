import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    console.log("Received request to upload file for server ID:", id);
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        const { searchParams } = new URL(req.url);
        const queryParams = searchParams.get("f") ? searchParams.get("f") : "";

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const apiUrl = `${process.env.SERVER_API_IP}/server/${id}/file/upload?f=${queryParams}`;

        const forwardFormData = new FormData();
        forwardFormData.append('file', file);

        const response = await fetch(apiUrl, {
            method: 'POST',
            body: forwardFormData,
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to upload file to API' + await response.text() }, { status: 500 });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error uploading file:', error.message);
        return NextResponse.json({ error: 'Internal server error: ' + error.message }, { status: 500 });
    }
}