import fs from 'fs';
import { google } from 'googleapis';
import path from 'path';

export const uploadFileToDrive = async (filePath: string, fileName: string, mimeType: string) => {
    try {
        if (!filePath || !fileName || !mimeType) {
            throw new Error('Faltan argumentos necesarios: filePath, fileName o mimeType');
        }

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
            scopes: ['https://www.googleapis.com/auth/drive'],
        });

        const drive = google.drive({ version: 'v3', auth });

        // Configurar el archivo como compartido públicamente
        await drive.permissions.create({
            fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        // Construir manualmente el enlace de visualización
        const fileLink = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;

        return fileLink;
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
        const file = await drive.files.get({
            fileId: fileId,
            fields: 'mimeType, permissions',
        });

        const mimeType = file.data.mimeType;
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp','aplication/pdf'];

        if (!mimeType || !allowedMimeTypes.includes(mimeType)) {
            console.error(`El archivo con ID ${fileId} no es una imagen. Tipo MIME: ${mimeType}`);
            return null; 
        }

        const permissions = file.data.permissions || [];
        const isPublic = permissions.some(permission => permission.role === 'reader' && permission.type === 'anyone');

        if (!isPublic) {
            await drive.permissions.create({
                fileId: fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });
        }

        return fileId;

    } catch (error) {
        console.error('Error al obtener o hacer público el archivo de Google Drive:', error);
        throw error;
    }
};



