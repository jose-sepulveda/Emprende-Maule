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
exports.uploadFileToDrive = void 0;
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
        yield listFiles();
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
const listFiles = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth = new googleapis_1.google.auth.GoogleAuth({
            keyFile: path_1.default.resolve(__dirname, '../config/credencial.json'),
            scopes: ['https://www.googleapis.com/auth/drive.readonly']
        });
        const drive = googleapis_1.google.drive({ version: 'v3', auth });
        const response = yield drive.files.list({
            pageSize: 10,
            fields: 'nextPageToken, files(id, name)',
        });
        console.log('Archivos en Drive:', response.data.files);
    }
    catch (error) {
        console.error('Error al listar archivos en Drive: ', error);
    }
});
