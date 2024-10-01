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
exports.updateEmprendedor = exports.getEmprendedor = exports.crearEmprendedor = exports.getEmprendedores = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const emprendedor_1 = require("../models/emprendedor");
const googleDrive_1 = require("./googleDrive");
const getEmprendedores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listEmprendedores = yield emprendedor_1.Emprendedor.findAll({
            attributes: [
                'rut_emprendedor',
                'contrasena',
                'nombre_emprendedor',
                'apellido1_emprendedor',
                'apellido2_emprendedor',
                'direccion',
                'telefono',
                'correo_electronico',
                'imagen_productos',
                'imagen_local',
                'comprobante',
                'tipo_de_cuenta',
                'numero_de_cuenta',
                'estado_emprendedor',
            ]
        });
        res.json(listEmprendedores);
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los emprendedores' });
    }
});
exports.getEmprendedores = getEmprendedores;
const crearEmprendedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rut_emprendedor, contrasena, nombre_emprendedor, apellido1_emprendedor, apellido2_emprendedor, direccion, telefono, correo_electronico, tipo_de_cuenta, numero_de_cuenta, estado_emprendedor } = req.body;
        const emprendedor = yield emprendedor_1.Emprendedor.findOne({ where: { rut_emprendedor: rut_emprendedor } });
        const emprededorCorreo = yield emprendedor_1.Emprendedor.findOne({ where: { correo_electronico: correo_electronico } });
        if (emprendedor) {
            res.status(400).json({
                msg: 'Ya existe un emprendedor con ese rut'
            });
            return;
        }
        if (emprededorCorreo) {
            res.status(400).json({
                msg: 'El correo utilizado ya ha sido utilizado'
            });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(contrasena, 10);
        const files = req.files;
        if (!(files === null || files === void 0 ? void 0 : files['comprobante']) || !(files === null || files === void 0 ? void 0 : files['imagen_local']) || !(files === null || files === void 0 ? void 0 : files['imagen_productos'])) {
            res.status(400).json({ message: 'Faltan archivos' });
            return;
        }
        const comprobantePath = path_1.default.join(__dirname, '../uploads', files['comprobante'][0].filename);
        const imagenLocalPath = path_1.default.join(__dirname, '../uploads', files['imagen_local'][0].filename);
        const imagenProductosPath = path_1.default.join(__dirname, '../uploads', files['imagen_productos'][0].filename);
        const comprobanteFileId = yield (0, googleDrive_1.uploadFileToDrive)(comprobantePath, files['comprobante'][0].originalname, 'aplication/pdf');
        fs_1.default.unlinkSync(comprobantePath);
        const imagenLocalFileId = yield (0, googleDrive_1.uploadFileToDrive)(imagenLocalPath, files['imagen_local'][0].originalname, 'image/jpeg');
        fs_1.default.unlinkSync(imagenLocalPath);
        const imagenProductosFileId = yield (0, googleDrive_1.uploadFileToDrive)(imagenProductosPath, files['imagen_productos'][0].originalname, 'image/jpeg');
        fs_1.default.unlinkSync(imagenProductosPath);
        const nuevoEmprendedor = yield emprendedor_1.Emprendedor.create({
            "rut_emprendedor": rut_emprendedor,
            "contrasena": hashedPassword,
            "nombre_emprendedor": nombre_emprendedor,
            "apellido1_emprendedor": apellido1_emprendedor,
            "apellido2_emprendedor": apellido2_emprendedor,
            "direccion": direccion,
            "telefono": telefono,
            "correo_electronico": correo_electronico,
            "imagen_productos": imagenProductosFileId,
            "imagen_local": imagenLocalFileId,
            "comprobante": comprobanteFileId,
            "tipo_de_cuenta": tipo_de_cuenta,
            "numero_de_cuenta": numero_de_cuenta,
            "estado_emprendedor": estado_emprendedor,
        });
        res.status(201).json({
            message: 'Emprendedor creado exitosamente',
            emprendedor: nuevoEmprendedor,
        });
    }
    catch (error) {
        console.error('Error al crear el emprendedor:', error.message);
        res.status(500).json({
            message: 'Error al crear el emprendedor',
            error: error.message || 'Error desconocido',
        });
    }
});
exports.crearEmprendedor = crearEmprendedor;
const getEmprendedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rut_emprendedor } = req.params;
    const rutEmprendedor = yield emprendedor_1.Emprendedor.findOne({
        attributes: [
            'rut_emprendedor',
            'contrasena',
            'nombre_emprendedor',
            'apellido1_emprendedor',
            'apellido2_emprendedor',
            'direccion',
            'telefono',
            'correo_electronico',
            'imagen_productos',
            'imagen_local',
            'comprobante',
            'tipo_de_cuenta',
            'numero_de_cuenta',
            'estado_emprendedor',
        ], where: { rut_emprendedor: rut_emprendedor }
    });
    if (!rutEmprendedor) {
        res.status(404).json({ msg: 'El rut de este emprendedor no existe' });
    }
    try {
        res.json(rutEmprendedor);
    }
    catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error',
            error
        });
    }
});
exports.getEmprendedor = getEmprendedor;
const updateEmprendedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rut_emprendedor } = req.params;
    const { contrasena, nombre_emprendedor, apellido1_emprendedor, apellido2_emprendedor, direccion, telefono, correo_electronico, tipo_de_cuenta, numero_de_cuenta, } = req.body;
    try {
        const rutEmprendedor = yield emprendedor_1.Emprendedor.findOne({ where: { rut_emprendedor: rut_emprendedor } });
        if (!rutEmprendedor) {
            return res.status(404).json({
                msg: 'El rut ' + rut_emprendedor + 'de este emprendedor no existe'
            });
        }
        if (contrasena) {
            const hashedPassword = yield bcrypt_1.default.hash(contrasena, 10);
            yield emprendedor_1.Emprendedor.update({
                "contrasena": hashedPassword,
                "nombre_emprendedor": nombre_emprendedor,
                "apellido1_emprendedor": apellido1_emprendedor,
                "apellido2_emprendedor": apellido2_emprendedor,
                "direccion": direccion,
                "telefono": telefono,
                "correo_electronico": correo_electronico,
                "tipo_de_cuenta": tipo_de_cuenta,
                "numero_de_cuenta": numero_de_cuenta,
            }, { where: { rut_emprendedor: rut_emprendedor } });
            return res.json({ msg: 'Se ha actualizado el emprendedor con rut: ', rut_emprendedor });
        }
        else {
            yield emprendedor_1.Emprendedor.update({
                "nombre_emprendedor": nombre_emprendedor,
                "apellido1_emprendedor": apellido1_emprendedor,
                "apellido2_emprendedor": apellido2_emprendedor,
                "direccion": direccion,
                "telefono": telefono,
                "correo_electronico": correo_electronico,
                "tipo_de_cuenta": tipo_de_cuenta,
                "numero_de_cuenta": numero_de_cuenta,
            }, { where: { rut_emprendedor: rut_emprendedor } });
            return res.json({ msg: 'Se ha actualizado el emprendedor con rut: ', rut_emprendedor });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error al actualizar el emprendedor' });
    }
});
exports.updateEmprendedor = updateEmprendedor;
