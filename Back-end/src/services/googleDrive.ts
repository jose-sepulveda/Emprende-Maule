import fs from 'fs';
import { google } from 'googleapis';
import { file } from 'googleapis/build/src/apis/file';
import path from 'path';

export const uploadFileToDrive = async (filePath: string, fileName: string, mimeType: string) => {
    try {

        const auth = new google.auth.GoogleAuth({
            keyFile: path.resolve(__dirname, '../config/credencial.json'),
            scopes: ['https://www.googleapis.com/auth/drive']
        });
        
        const drive = google.drive({ version: 'v3', auth});

        const folderId = '1ZMbSJ_RBwdGZvWvmI5ib4OPHxepGuosg'
        

        const fileMetadata = {
            name: fileName,
            parents: [folderId],
        };

        const media = {
            mimeType: mimeType,
            body: fs.createReadStream(filePath),
        };

        const response = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id, name',
        });

        console.log('Archivo subido exitosamente: ', response.data.id);

        return response.data.id;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error al subir el archivo: ', error.message);
            if ((error as any).response) {
                console.error('Detalle del error: ', (error as any).response.data)
        }
        } else {
            console.error('Error desconocido al subir el archivo');
        }
        return null;
        
    }
}

export const deleteFileFromDrive = async (fileId: string): Promise<void> => {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: path.join(__dirname, '../config/credencial.json'),
            scopes: ['https://www.googleapis.com/auth/drive']
        });

        const drive = google.drive({ version: 'v3', auth});

        await drive.files.delete({
            fileId,
        });

        console.log(`Archivo con ID ${fileId} eliminado de Google Drive `);
    } catch (error) {
        console.error(`Error eliminando el archivo con ID ${fileId}`, error);
        throw new Error(`Error eliminando archivo de Google Drive: ${fileId}`);
    }
}

export const uploadPhoToToDrive = async (filePath: string, fileName: string, mimeType: string) => {
    try {

        const auth = new google.auth.GoogleAuth({
            keyFile: path.resolve(__dirname, '../config/credencial.json'),
            scopes: ['https://www.googleapis.com/auth/drive']
        });
        
        const drive = google.drive({ version: 'v3', auth});

        const photoFolderId = '1hP3jeqSNPqV7i3Jh5X1s9b4X7wqFc-tw';

        const fileMetadata = {
            name: fileName,
            parents: [photoFolderId],
        };

        const media = {
            mimeType: mimeType,
            body: fs.createReadStream(filePath),
        };

        const response = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id, name',
        });

        console.log('Archivo subido exitosamente: ', response.data.id);

        return response.data.id;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error al subir el archivo: ', error.message);
            if ((error as any).response) {
                console.error('Detalle del error: ', (error as any).response.data)
        }
        } else {
            console.error('Error desconocido al subir el archivo');
        }
        return null;
        
    }
}

