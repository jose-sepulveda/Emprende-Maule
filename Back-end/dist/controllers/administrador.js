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
exports.resetPasswordAdmin = exports.recuperarContrasena = exports.getAdministradores = exports.getAdminById = exports.loginAdmin = exports.updateAdmin = exports.deleteAdmin = exports.newAdmin = void 0;
const administrador_1 = require("../models/administrador");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mail_1 = require("../services/mail");
const newAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rut_administrador, contrasena, nombre_administrador, apellido1_administrador, apellido2_administrador, correo } = req.body;
    const administrador = yield administrador_1.Administrador.findOne({ where: { rut_administrador: rut_administrador } });
    if (administrador) {
        return res.status(400).json({
            msg: 'El administrador ya existe'
        });
    }
    const hashedpassword = yield bcrypt_1.default.hash(contrasena, 10);
    try {
        yield administrador_1.Administrador.create({
            "rut_administrador": rut_administrador,
            "contrasena": hashedpassword,
            "nombre_administrador": nombre_administrador,
            "apellido1_administrador": apellido1_administrador,
            "apellido2_administrador": apellido2_administrador,
            "correo": correo,
        });
        return res.status(201).json({
            msg: 'Administrador creado exitosamente'
        });
    }
    catch (error) {
        res.status(400).json({
            msg: 'Error al crear el administrador',
            error
        });
    }
});
exports.newAdmin = newAdmin;
const deleteAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_administrador } = req.params;
    const idAdministrador = yield administrador_1.Administrador.findOne({ where: { id_administrador: id_administrador } });
    if (!idAdministrador) {
        return res.status(404).json({
            msg: 'El administrador no existe'
        });
    }
    try {
        yield administrador_1.Administrador.destroy({ where: { id_administrador: id_administrador }, cascade: true });
        res.json({
            msg: 'El administrador ha sido eliminado'
        });
    }
    catch (error) {
        res.status(400).json({
            msg: 'No se ha podido eliminar el administrador',
            error
        });
    }
});
exports.deleteAdmin = deleteAdmin;
const updateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_administrador } = req.params;
    const { nombre_administrador, apellido1_administrador, apellido2_administrador, contrasena } = req.body;
    const administrador = yield administrador_1.Administrador.findOne({ where: { id_administrador: id_administrador } });
    if (!administrador) {
        return res.status(404).json({
            msg: 'El administrador no existe'
        });
    }
    let hashedpassword;
    if (contrasena) {
        hashedpassword = yield bcrypt_1.default.hash(contrasena, 10);
    }
    try {
        yield administrador.update(Object.assign({ nombre_administrador,
            apellido1_administrador,
            apellido2_administrador }, (contrasena && { contrasena: hashedpassword })));
        res.json({
            msg: 'Administrador actualizado exitosamente'
        });
    }
    catch (error) {
        res.status(400).json({
            msg: 'Error al actualizar el administrador',
            error
        });
    }
});
exports.updateAdmin = updateAdmin;
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rut_administrador, contrasena } = req.body;
    const administrador = yield administrador_1.Administrador.findOne({ where: { rut_administrador: rut_administrador } });
    if (!administrador) {
        return res.status(404).json({
            msg: 'El administrador no existe'
        });
    }
    const passwordValida = yield bcrypt_1.default.compare(contrasena, administrador.dataValues.contrasena);
    if (!passwordValida) {
        return res.status(401).json({
            msg: 'Contraseña Incorrecta'
        });
    }
    const rol = 'administrador';
    const id_administrador = administrador.dataValues.id_administrador;
    const token = jsonwebtoken_1.default.sign({
        rut_administrador: rut_administrador,
        role: rol
    }, process.env.SECRET_KEY || 'ACCESS', { expiresIn: '1h' });
    res.json({ token, rol: rol, id_administrador: id_administrador });
});
exports.loginAdmin = loginAdmin;
const getAdminById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_administrador } = req.params;
    try {
        const administrador = yield administrador_1.Administrador.findOne({ where: { id_administrador: id_administrador } });
        if (!administrador) {
            return res.status(404).json({
                msg: 'El administrador no existe'
            });
        }
        return res.json(administrador);
    }
    catch (error) {
        return res.status(500).json({
            msg: 'Error al obtener el administrador',
            error
        });
    }
});
exports.getAdminById = getAdminById;
const getAdministradores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const administradores = yield administrador_1.Administrador.findAll();
        if (!administradores || administradores.length === 0) {
            return res.status(404).json({
                msg: 'No hay administradores'
            });
        }
        return res.json(administradores);
    }
    catch (error) {
        return res.status(500).json({
            msg: 'Error al obtener los administradores',
            error
        });
    }
});
exports.getAdministradores = getAdministradores;
const recuperarContrasena = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo } = req.body;
    try {
        const administrador = yield administrador_1.Administrador.findOne({ where: { correo } });
        if (!administrador) {
            return res.status(400).json({
                msg: 'No se encontró un administrador con ese correo'
            });
        }
        const token = jsonwebtoken_1.default.sign({ correo }, process.env.SECRET_KEY || 'ACCESS', { expiresIn: '1h' });
        const link = `http://localhost:3000/reset-password/${token}`;
        yield (0, mail_1.sendEmail)(correo, 'Recuperación de contraseña', `Haz clic en el siguiente enlace para recuperar tu contraseña: ${link}`);
        return res.status(200).json({
            msg: 'Se envió un enlace de recuperación de contraseña a tu correo'
        });
    }
    catch (error) {
        console.error('Error al enviar el correo:', error);
        return res.status(500).json({
            msg: 'Error al enviar el correo. Inténtalo más tarde.',
        });
    }
});
exports.recuperarContrasena = recuperarContrasena;
const resetPasswordAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { nuevaContrasena } = req.body;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || 'ACCESS');
        const administrador = yield administrador_1.Administrador.findOne({ where: { correo: decoded.correo } });
        if (!administrador) {
            return res.status(400).json({
                msg: 'No se encontró un administrador con ese correo',
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(nuevaContrasena, 10);
        yield administrador_1.Administrador.update({ contrasena: hashedPassword }, { where: { correo: decoded.correo } });
        yield (0, mail_1.sendEmail)(decoded.correo, 'Contraseña restablecida', 'Tu contraseña ha sido restablecida exitosamente.');
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
exports.resetPasswordAdmin = resetPasswordAdmin;
