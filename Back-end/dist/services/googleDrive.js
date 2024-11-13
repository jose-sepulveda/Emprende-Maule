"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPublicAccessToFile = exports.getFilesFromDrive = exports.uploadPhoToToDrive = exports.deleteFileFromDrive = exports.uploadFileToDrive = void 0;
const fs_1 = __importDefault(require("fs"));
const googleapis_1 = require("googleapis");
const path_1 = __importDefault(require("path"));
const uploadFileToDrive = (filePath, fileName, mimeType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth = new googleapis_1.google.auth.GoogleAuth({
            keyFile: path_1.default.resolve(__dirname, '../config/credencial.json'),
            scopes: ['https://www.googleapis.com/auth/drive']
        });
        const drive = googleapis_1.google.drive({ version: 'v3', auth });
        const folderId = '1ZMbSJ_RBwdGZvWvmI5ib4OPHxepGuosg';
        const fileMetadata = {
            name: fileName,
            parents: [folderId],
        };
        const media = {
            mimeType: mimeType,
            body: fs_1.default.createReadStream(filePath),
        };
        const response = yield drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id, name',
        });
        console.log('Archivo subido exitosamente: ', response.data.id);
        return response.data.id;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error al subir el archivo: ', error.message);
            if (error.response) {
                console.error('Detalle del error: ', error.response.data);
            }
        }
        else {
            console.error('Error desconocido al subir el archivo');
        }
        return null;
    }
});
exports.uploadFileToDrive = uploadFileToDrive;
const deleteFileFromDrive = (fileId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth = new googleapis_1.google.auth.GoogleAuth({
            keyFile: path_1.default.join(__dirname, '../config/credencial.json'),
            scopes: ['https://www.googleapis.com/auth/drive']
        });
        const drive = googleapis_1.google.drive({ version: 'v3', auth });
        yield drive.files.delete({
            fileId,
        });
        console.log(`Archivo con ID ${fileId} eliminado de Google Drive `);
    }
    catch (error) {
        console.error(`Error eliminando el archivo con ID ${fileId}`, error);
        throw new Error(`Error eliminando archivo de Google Drive: ${fileId}`);
    }
});
exports.deleteFileFromDrive = deleteFileFromDrive;
const uploadPhoToToDrive = (filePath, fileName, mimeType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth = new googleapis_1.google.auth.GoogleAuth({
            keyFile: path_1.default.resolve(__dirname, '../config/credencial.json'),
            scopes: ['https://www.googleapis.com/auth/drive']
        });
        const drive = googleapis_1.google.drive({ version: 'v3', auth });
        const photoFolderId = '1hP3jeqSNPqV7i3Jh5X1s9b4X7wqFc-tw';
        const fileMetadata = {
            name: fileName,
            parents: [photoFolderId],
        };
        const media = {
            mimeType: mimeType,
            body: fs_1.default.createReadStream(filePath),
        };
        const response = yield drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id, name',
        });
        console.log('Archivo subido exitosamente: ', response.data.id);
        return response.data.id;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error al subir el archivo: ', error.message);
            if (error.response) {
                console.error('Detalle del error: ', error.response.data);
            }
        }
        else {
            console.error('Error desconocido al subir el archivo');
        }
        return null;
    }
});
exports.uploadPhoToToDrive = uploadPhoToToDrive;
const getFilesFromDrive = (fileId) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = new googleapis_1.google.auth.GoogleAuth({
        keyFile: path_1.default.resolve(__dirname, '../config/credencial.json'),
        scopes: ['https://www.googleapis.com/auth/drive'],
    });
    const drive = googleapis_1.google.drive({ version: 'v3', auth });
    try {
        // Obtener el archivo con la ID proporcionada
        const file = yield drive.files.get({
            fileId: fileId,
            fields: 'id',
        });
        if (file.data.id) {
            // Hacer el archivo público
            yield drive.permissions.create({
                fileId: file.data.id,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });
            // Construir el enlace directo para la visualización de la imagen
            const directUrl = `https://drive.google.com/uc?export=view&id=${file.data.id}`;
            return directUrl;
        }
        else {
            throw new Error('El archivo no tiene un enlace de visualización disponible');
        }
    }
    catch (error) {
        console.error('Error al obtener el archivo desde Google Drive:', error);
        throw error;
    }
});
exports.getFilesFromDrive = getFilesFromDrive;
const setPublicAccessToFile = (fileId) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = new googleapis_1.google.auth.GoogleAuth({
        keyFile: path_1.default.resolve(__dirname, '../config/credencial.json'),
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], // Usamos el alcance solo de lectura
    });
    const drive = googleapis_1.google.drive({ version: 'v3', auth });
    try {
        // Obtenemos el enlace público de vista del archivo
        const file = yield drive.files.get({
            fileId: fileId,
            fields: 'webViewLink', // Esto devuelve un enlace para ver el archivo
        });
        // Verifica si el archivo tiene el enlace de vista
        if (file.data.webViewLink) {
            return file.data.webViewLink; // Retorna el enlace
        }
        else {
            throw new Error('No se pudo obtener el enlace del archivo');
        }
    }
    catch (error) {
        console.error('Error al obtener el archivo de Google Drive:', error);
        throw error; // Lanza el error para manejarlo donde sea necesario
    }
});
exports.setPublicAccessToFile = setPublicAccessToFile;
