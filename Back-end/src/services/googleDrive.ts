import fs from 'fs';
import { google } from 'googleapis';
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


export const getFilesFromDrive = async (fileId: string) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: path.resolve(__dirname, '../config/credencial.json'),
        scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });

    try {
        // Obtener el archivo con la ID proporcionada
        const file = await drive.files.get({
            fileId: fileId,
            fields: 'id',
        });

        if (file.data.id) {
            // Hacer el archivo público
            await drive.permissions.create({
                fileId: file.data.id,
                requestBody: {
                    role: 'reader', 
                    type: 'anyone', 
                },
            });

            // Construir el enlace directo para la visualización de la imagen
            const directUrl = `https://drive.google.com/uc?export=view&id=${file.data.id}`;
            return directUrl;
        } else {
            throw new Error('El archivo no tiene un enlace de visualización disponible');
        }
    } catch (error) {
        console.error('Error al obtener el archivo desde Google Drive:', error);
        throw error;
    }
};

export const setPublicAccessToFile = async (fileId:string) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: path.resolve(__dirname, '../config/credencial.json'),
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], // Usamos el alcance solo de lectura
    });

    const drive = google.drive({ version: 'v3', auth });

    try {
        // Obtenemos el enlace público de vista del archivo
        const file = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink', // Esto devuelve un enlace para ver el archivo
        });

        // Verifica si el archivo tiene el enlace de vista
        if (file.data.webViewLink) {
            return file.data.webViewLink; // Retorna el enlace
        } else {
            throw new Error('No se pudo obtener el enlace del archivo');
        }
    } catch (error) {
        console.error('Error al obtener el archivo de Google Drive:', error);
        throw error; // Lanza el error para manejarlo donde sea necesario
    }
};


