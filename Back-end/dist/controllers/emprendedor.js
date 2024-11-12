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
exports.getEmprendedoresPorEstado = exports.resetPasswordEmprendedor = exports.recuperarContrasenaEmprendedor = exports.updateEstadoEmprendedor = exports.deleteEmprendedor = exports.updateEmprendedor = exports.updatePassword = exports.loginEmprendedor = exports.getEmprendedor = exports.crearEmprendedor = exports.getEmprendedores = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const fs_1 = __importDefault(require("fs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const emprendedor_1 = require("../models/emprendedor");
const googleDrive_1 = require("../services/googleDrive");
const mail_1 = require("../services/mail");
const getEmprendedores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listEmprendedores = yield emprendedor_1.Emprendedor.findAll({
            attributes: [
                'id_emprendedor',
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
        const { rut_emprendedor, contrasena, nombre_emprendedor, apellido1_emprendedor, apellido2_emprendedor, direccion, telefono, correo_electronico, tipo_de_cuenta, numero_de_cuenta } = req.body;
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
            "estado_emprendedor": 'Pendiente',
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
    try {
        const rutEmprendedor = yield emprendedor_1.Emprendedor.findOne({
            attributes: [
                'id_emprendedor',
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
            if (!res.headersSent) {
                res.status(404).json({ msg: 'El rut de este emprendedor no existe' });
            }
        }
        const emprendedorData = rutEmprendedor === null || rutEmprendedor === void 0 ? void 0 : rutEmprendedor.get();
        const { imagen_productos, imagen_local, comprobante } = emprendedorData;
        const files = yield Promise.all([
            imagen_productos ? (0, googleDrive_1.getFilesFromDrive)(imagen_productos) : null,
            imagen_local ? (0, googleDrive_1.getFilesFromDrive)(imagen_local) : null,
            comprobante ? (0, googleDrive_1.getFilesFromDrive)(comprobante) : null,
        ]);
        if (!res.headersSent) {
            res.json({
                emprendedor: Object.assign(Object.assign({}, emprendedorData), { imagen_productos: files[0] || null, imagen_local: files[1] || null, comprobante: files[2] || null }),
            });
        }
    }
    catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error',
            error
        });
    }
});
exports.getEmprendedor = getEmprendedor;
const loginEmprendedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo_electronico, contrasena } = req.body;
    const emprendedor = yield emprendedor_1.Emprendedor.findOne({ where: { correo_electronico: correo_electronico } });
    if (!emprendedor) {
        return res.status(401).json({
            msg: 'El correo ingresado no es valido'
        });
    }
    const emprendedorPassword = yield bcrypt_1.default.compare(contrasena, emprendedor.dataValues.contrasena);
    if (!emprendedorPassword) {
        return res.status(401).json({
            msg: 'Contraseña Incorrecta'
        });
    }
    const rol = 'emprendedor';
    const id_emprendedor = emprendedor.dataValues.id_emprendedor;
    const token = jsonwebtoken_1.default.sign({
        correo: correo_electronico,
        role: rol,
        id_emprendedor: id_emprendedor
    }, process.env.SECRET_KEY || 'ACCESS');
    res.json({ token, rol: rol, id_emprendedor: id_emprendedor });
});
exports.loginEmprendedor = loginEmprendedor;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rut_emprendedor, contrasena } = req.body;
    console.log('RUT recibido:', rut_emprendedor);
    console.log('Contraseña recibida:', contrasena);
    if (!rut_emprendedor) {
        return res.status(400).json({
            msg: 'Por favor, ingrese un Rut valido',
        });
    }
    if (!contrasena) {
        return res.status(400).json({
            msg: 'Por favor, ingrese una nueva contraseña',
        });
    }
    try {
        const emprendedor = yield emprendedor_1.Emprendedor.findOne({ where: { rut_emprendedor: rut_emprendedor } });
        if (!emprendedor) {
            return res.status(404).json({
                msg: 'Emprendedor no encontrado',
            });
        }
        const antigua_contraseña = emprendedor.getDataValue('contrasena');
        const compara_contrasenas = yield bcrypt_1.default.compare(contrasena, antigua_contraseña);
        if (compara_contrasenas) {
            return res.status(400).json({
                msg: 'La nueva contraseña no puede ser igual al anterior',
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(contrasena, 10);
        yield emprendedor_1.Emprendedor.update({ contrasena: hashedPassword }, { where: { rut_emprendedor: rut_emprendedor } });
        return res.status(200).json({
            msg: 'Contraseña actualizada correctamente',
        });
    }
    catch (error) {
        console.error('Error al actualizar la contraseña', error);
        return res.status(500).json({
            msg: 'Error actualizando la contraseña. Intentelo mas tarde',
        });
    }
});
exports.updatePassword = updatePassword;
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
const deleteEmprendedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rut_emprendedor } = req.params;
    try {
        const emprendedor = yield emprendedor_1.Emprendedor.findOne({ where: { rut_emprendedor: rut_emprendedor } });
        if (!emprendedor) {
            return res.status(404).json({ msg: 'Emprendedor no encontrado' });
        }
        const comprobanteId = emprendedor.getDataValue('comprobante');
        const imagenLocalId = emprendedor.getDataValue('imagen_local');
        const imagenProductosId = emprendedor.getDataValue('imagen_productos');
        if (comprobanteId) {
            yield (0, googleDrive_1.deleteFileFromDrive)(comprobanteId);
        }
        if (imagenLocalId) {
            yield (0, googleDrive_1.deleteFileFromDrive)(imagenLocalId);
        }
        if (imagenProductosId) {
            yield (0, googleDrive_1.deleteFileFromDrive)(imagenProductosId);
        }
        yield emprendedor.destroy();
        return res.json({ msg: 'Emprendedor y sus archivos eliminados correctamente' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error eliminando al emprendedor' });
    }
});
exports.deleteEmprendedor = deleteEmprendedor;
const updateEstadoEmprendedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rut_emprendedor, nuevoEstado } = req.body;
    console.log("Nuevo estado: ", nuevoEstado);
    try {
        const emprendedor = yield emprendedor_1.Emprendedor.findOne({ where: { rut_emprendedor } });
        if (!emprendedor) {
            return res.status(404).json({
                msg: 'Emprendedor no encontrado'
            });
        }
        const estadoActual = emprendedor.getDataValue('estado_emprendedor');
        if (estadoActual !== 'Pendiente') {
            return res.status(400).json({
                msg: 'El emprendedor no esta en estado pendiente',
            });
        }
        if (nuevoEstado === 'Aprobado') {
            yield (0, mail_1.sendEmail)(emprendedor.getDataValue('correo_electronico'), 'Cuenta Aprobada', `Hola ${emprendedor.getDataValue('nombre_emprendedor')}.
                Tu cuenta ha sido aprobada exitosamente.
                ¡Bienvenido a Emprende Maule!`);
            yield emprendedor.update({ estado_emprendedor: nuevoEstado });
            return res.status(200).json({
                msg: 'Estado actualizado a Aprovado y correo enviado',
            });
        }
        if (nuevoEstado == 'Rechazado') {
            yield (0, googleDrive_1.deleteFileFromDrive)(emprendedor.getDataValue('comprobante'));
            console.log(`Archivo con ID ${emprendedor.getDataValue('comprobante')} eliminado`);
            yield (0, googleDrive_1.deleteFileFromDrive)(emprendedor.getDataValue('imagen_local'));
            console.log(`Archivo con ID ${emprendedor.getDataValue('imagen_local')} eliminado`);
            yield (0, googleDrive_1.deleteFileFromDrive)(emprendedor.getDataValue('imagen_productos'));
            console.log(`Archivo con ID ${emprendedor.getDataValue('imagen_productos')} eliminado`);
            yield (0, mail_1.sendEmail)(emprendedor.getDataValue('correo_electronico'), 'Cuenta Rechazada', `Hola ${emprendedor.getDataValue('nombre_emprendedor')},
                Lamentamos informarte que tu cuenta fue rechazada porque no cumplia con los requisitos para el registro`);
            yield emprendedor_1.Emprendedor.destroy({ where: { rut_emprendedor } });
            return res.status(200).json({
                msg: 'Estado actualizado a Rechazado, archivos eliminados y correo enviado',
            });
        }
        return res.status(400).json({ msg: 'Estado no valido' });
    }
    catch (error) {
        console.error('Error al acualizar el estado del emprendedor: ', error);
        return res.status(500).json({
            msg: 'Error al actualizar el estado. Inténtalo más tarde.',
        });
    }
});
exports.updateEstadoEmprendedor = updateEstadoEmprendedor;
const recuperarContrasenaEmprendedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo_electronico } = req.body;
    try {
        const emprendedor = yield emprendedor_1.Emprendedor.findOne({ where: { correo_electronico } });
        if (!emprendedor) {
            return res.status(404).json({ msg: 'No existe un emprendedor con ese correo' });
        }
        const token = jsonwebtoken_1.default.sign({ correo_electronico: emprendedor.getDataValue("correo_electronico"), id_emprendedor: emprendedor.getDataValue("id_emprendedr"), rol: "emprendedor" }, process.env.SECRET_KEY || 'ACCESS', { expiresIn: '1h' });
        const link = `http://localhost:3001/#/reset-password-emprendedor/${token}`;
        yield (0, mail_1.sendEmail)(correo_electronico, 'Recuperar contraseña', `Haz clic en el siguiente enlace para recuperar tu contraseña: ${link}`);
        return res.status(200).json({ msg: 'Se envio un enlace de recuperacion de contraseña a tu correo' });
    }
    catch (error) {
        console.error('Error al enviar el correo:', error);
        return res.status(500).json({ msg: 'Error al enviar el correo' });
    }
});
exports.recuperarContrasenaEmprendedor = recuperarContrasenaEmprendedor;
const resetPasswordEmprendedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { contrasenaActual, nuevaContrasena } = req.body;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || 'ACCESS');
        const emprendedor = yield emprendedor_1.Emprendedor.findOne({ where: { correo_electronico: decoded.correo_electronico } });
        if (!emprendedor) {
            return res.status(400).json({
                msg: 'No se encontró un emprendedor con ese correo',
            });
        }
        const contrasenaActualValida = yield bcrypt_1.default.compare(contrasenaActual, emprendedor.getDataValue('contrasena'));
        if (!contrasenaActualValida) {
            return res.status(400).json({
                msg: 'La contraseña actual es incorrecta',
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(nuevaContrasena, 10);
        yield emprendedor_1.Emprendedor.update({ contrasena: hashedPassword }, { where: { correo_electronico: decoded.correo_electronico } });
        yield (0, mail_1.sendEmail)(decoded.correo_electronico, 'Contraseña restablecida', 'Tu contraseña ha sido restablecida exitosamente.');
        return res.status(200).json({
            msg: 'Se ha restablecido la contraseña exitosamente',
        });
    }
    catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        return res.status(500).json({
            msg: 'Error al restablecer la contraseña. Inténtalo más tarde.',
        });
    }
});
exports.resetPasswordEmprendedor = resetPasswordEmprendedor;
const getEmprendedoresPorEstado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { estado } = req.query;
    if (estado !== 'Pendiente' && estado !== 'Aprobado') {
        return res.status(400).json({
            msg: 'El estado debe ser "Pendiente" o "Aprobado".'
        });
    }
    try {
        const emprendedores = yield emprendedor_1.Emprendedor.findAll({
            where: {
                estado_emprendedor: estado
            }
        });
        if (!emprendedores || emprendedores.length === 0) {
            return res.status(404).json({
                msg: `No se encontraron emprendedores con estado ${estado}.`
            });
        }
        return res.status(200).json(emprendedores);
    }
    catch (error) {
        console.error('Error al obtener los emprendedores por estado: ', error);
        return res.status(500).json({
            msg: 'Error al obtener los emprendedores. Inténtalo más tarde.',
        });
    }
});
exports.getEmprendedoresPorEstado = getEmprendedoresPorEstado;
