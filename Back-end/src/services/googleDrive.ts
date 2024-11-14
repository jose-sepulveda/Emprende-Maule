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
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: path.resolve(__dirname, '../config/credencial.json'),
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        });

        const drive = google.drive({ version: 'v3', auth });

        // Obtener los metadatos del archivo
        const response = await drive.files.get({
            fileId,
            fields: 'webViewLink', // Solo solicitamos el enlace para ver el archivo
        });

        const fileLink = response.data.webViewLink; // Devuelve el enlace para visualizar el archivo

        return fileLink || null;
    } catch (error) {
        console.error('Error al obtener el archivo de Google Drive:', error);
        return null;
    }
};

export const setPublicAccessToFile = async (fileId: string) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: path.resolve(__dirname, '../config/credencial.json'),
        scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });

    try {
        // Obtenemos el archivo para asegurarnos de que se pueda acceder públicamente
        const file = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink,permissions', // Obtén los permisos y el enlace de vista
        });

        // Verifica si el archivo tiene permisos públicos
        const permissions = file.data.permissions || [];
        const isPublic = permissions.some(permission => permission.role === 'reader' && permission.type === 'anyone');

        if (!isPublic) {
            // Cambia los permisos para hacerlo público
            await drive.permissions.create({
                fileId: fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });
        }

        // Retorna el enlace público accesible directamente
        return `https://drive.google.com/uc?export=view&id=${fileId}`;

    } catch (error) {
        console.error('Error al obtener o hacer público el archivo de Google Drive:', error);
        throw error; // Lanza el error para manejarlo donde sea necesario
    }
};



