import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { NextApiResponse } from 'next';


export default async function fileDownloader(path: string) {
    // check of path exists (file/folder)
    if(!fs.existsSync(path)){
        return null
    }


    // check if path is folder or file
    const isFile = fs.lstatSync(path).isFile();
    if(isFile){
        return function Send(res: NextApiResponse){
            const file = fs.createReadStream(path);
            file.pipe(res);
        }
    }
    else{
        // if folder, zip folder and send
        const tempZipPath = '/temp/temp.zip';
        const output = fs.createWriteStream(tempZipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        archive.directory(path, false);

        archive.pipe(output);

        await archive.finalize();

        return function Send(res: NextApiResponse){
            const file = fs.createReadStream(tempZipPath);
            file.pipe(res);
            //remove zip file after sending
            fs.unlinkSync(tempZipPath);
        }

    }
}