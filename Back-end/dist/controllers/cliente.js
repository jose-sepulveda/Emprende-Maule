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
exports.getClientes = exports.getClienteById = exports.resetPasswordCliente = exports.recuperarContrasenaCliente = exports.loginCliente = exports.updateCliente = exports.deleteCliente = exports.newCliente = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cliente_1 = require("../models/cliente");
const mail_1 = require("../services/mail");
const newCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rut_cliente, contrasena, nombre_cliente, apellido1_cliente, apellido2_cliente, direccion, telefono, correo } = req.body;
    const cliente = yield cliente_1.Cliente.findOne({ where: { rut_cliente: rut_cliente } });
    const clienteCorreo = yield cliente_1.Cliente.findOne({ where: { correo: correo } });
    if (cliente) {
        return res.status(400).json({
            msg: 'Ya existe un cliente con ese rut'
        });
    }
    if (clienteCorreo) {
        return res.status(400).json({
            msg: 'El correo utilizado ya ha sido utilizado'
        });
    }
    const hashedPassword = yield bcrypt_1.default.hash(contrasena, 10);
    try {
        yield cliente_1.Cliente.create({
            "rut_cliente": rut_cliente,
            "contrasena": hashedPassword,
            "nombre_cliente": nombre_cliente,
            "apellido1_cliente": apellido1_cliente,
            "apellido2_cliente": apellido2_cliente,
            "direccion": direccion,
            "telefono": telefono,
            "correo": correo,
            "estado_cliente": false
        });
        yield (0, mail_1.sendEmail)(correo, 'Cuenta Creada', `Hola ${nombre_cliente}!. Tu cuenta ha sido creada exitosamente.`);
        return res.status(201).json({
            msg: 'Se ha registrado exitosamente'
        });
    }
    catch (error) {
        res.status(400).json({
            msg: 'No se ha podido registrar el cliente',
            error
        });
    }
});
exports.newCliente = newCliente;
const deleteCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_cliente } = req.params;
    const idCliente = yield cliente_1.Cliente.findOne({ where: { id_cliente: id_cliente } });
    if (!idCliente) {
        return res.status(404).json({
            msg: 'El cliente no existe'
        });
    }
    try {
        yield cliente_1.Cliente.destroy({ where: { id_cliente: id_cliente }, cascade: true });
        res.json({
            msg: 'El cliente ha sido eliminado'
        });
    }
    catch (error) {
        res.status(400).json({
            msg: 'No se ha podido eliminar el cliente',
            error
        });
    }
});
exports.deleteCliente = deleteCliente;
const updateCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_cliente } = req.params;
    const idCliente = yield cliente_1.Cliente.findOne({ where: { id_cliente: id_cliente } });
    if (!idCliente) {
        return res.status(404).json({
            msg: 'El cliente no existe'
        });
    }
    try {
        const { nombre_cliente, apellido1_cliente, apellido2_cliente, contrasena, direccion, correo, estado_cliente } = req.body;
        if (!contrasena && !nombre_cliente && !apellido1_cliente && !apellido2_cliente && !direccion && !correo && !estado_cliente) {
            yield cliente_1.Cliente.update({
                estado_cliente: estado_cliente
            }, { where: { id_cliente: id_cliente }
            });
            return res.json({
                msg: 'El cliente ha sido actualizado'
            });
        }
        if (contrasena != (idCliente === null || idCliente === void 0 ? void 0 : idCliente.dataValues.contrasena)) {
            const hashedPassword = yield bcrypt_1.default.hash(contrasena, 10);
            yield cliente_1.Cliente.update({
                nombre_cliente: nombre_cliente,
                apellido1_cliente: apellido1_cliente,
                apellido2_cliente: apellido2_cliente,
                contrasena: hashedPassword,
                direccion: direccion,
                correo: correo,
                estado_cliente: estado_cliente
            }, { where: { id_cliente: id_cliente }
            });
            return res.json({
                msg: 'El cliente ha sido actualizado'
            });
        }
        else {
            yield cliente_1.Cliente.update({
                nombre_cliente: nombre_cliente,
                apellido1_cliente: apellido1_cliente,
                apellido2_cliente: apellido2_cliente,
                contrasena: contrasena,
                direccion: direccion,
                correo: correo
            }, { where: { id_cliente: id_cliente }
            });
            return res.json({
                msg: 'El cliente ha sido actualizado'
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            msg: 'No se ha podido actualizar el cliente',
            error
        });
    }
});
exports.updateCliente = updateCliente;
const loginCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, contrasena } = req.body;
    const cliente = yield cliente_1.Cliente.findOne({ where: { correo: correo } });
    if (!cliente) {
        return res.status(401).json({
            msg: 'El correo ingresado no es valido'
        });
    }
    const passwordValida = yield bcrypt_1.default.compare(contrasena, cliente.contrasena);
    if (!passwordValida) {
        return res.status(401).json({
            msg: 'Contraseña Incorrecta'
        });
    }
    const rol = 'cliente';
    const id_cliente = cliente.dataValues.id_cliente;
    const token = jsonwebtoken_1.default.sign({
        correo: correo,
        role: rol,
        id_cliente: id_cliente
    }, process.env.SECRET_KEY || 'ACCESS');
    res.json({ token, rol: rol, id_cliente: id_cliente });
});
exports.loginCliente = loginCliente;
const recuperarContrasenaCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo } = req.body;
    try {
        const cliente = yield cliente_1.Cliente.findOne({ where: { correo } });
        if (!cliente) {
            return res.status(400).json({
                msg: 'No se encontró un cliente con ese correo',
            });
        }
        const token = jsonwebtoken_1.default.sign({ correo: cliente.getDataValue("correo"), id_cliente: cliente.getDataValue("id_cliente"), rol: "cliente" }, process.env.SECRET_KEY || 'ACCESS', { expiresIn: '1h' });
        const link = `http://localhost:3001/#/reset-password-cliente/${token}`;
        yield (0, mail_1.sendEmail)(correo, 'Recuperación de contraseña', `Haz clic en el siguiente enlace para recuperar tu contraseña: ${link}`);
        return res.status(200).json({
            msg: 'Se envió un enlace de recuperación de contraseña a tu correo',
        });
    }
    catch (error) {
        console.error('Error al enviar el correo:', error);
        return res.status(500).json({
            msg: 'Error al enviar el correo. Inténtalo más tarde.',
        });
    }
});
exports.recuperarContrasenaCliente = recuperarContrasenaCliente;
const resetPasswordCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { contrasenaActual, nuevaContrasena } = req.body;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || 'ACCESS');
        const cliente = yield cliente_1.Cliente.findOne({ where: { correo: decoded.correo } });
        if (!cliente) {
            return res.status(400).json({
                msg: 'No se encontró un cliente con ese correo',
            });
        }
        const contrasenaActualValida = yield bcrypt_1.default.compare(contrasenaActual, cliente.getDataValue('contrasena'));
        if (!contrasenaActualValida) {
            return res.status(400).json({
                msg: 'La contraseña actual es incorrecta',
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(nuevaContrasena, 10);
        yield cliente_1.Cliente.update({ contrasena: hashedPassword }, { where: { correo: decoded.correo } });
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
exports.resetPasswordCliente = resetPasswordCliente;
const getClienteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_cliente } = req.params;
    try {
        const cliente = yield cliente_1.Cliente.findOne({ where: { id_cliente: id_cliente } });
        if (!cliente) {
            return res.status(404).json({
                msg: 'El cliente no existe'
            });
        }
        return res.json(cliente);
    }
    catch (error) {
        return res.status(500).json({
            msg: 'Error al obtener el cliente',
            error
        });
    }
});
exports.getClienteById = getClienteById;
const getClientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientes = yield cliente_1.Cliente.findAll();
        if (!clientes || clientes.length === 0) {
            return res.status(404).json({
                msg: 'No hay clientes'
            });
        }
        return res.json(clientes);
    }
    catch (error) {
        return res.status(500).json({
            msg: 'Error al obtener los clientes',
            error
        });
    }
});
exports.getClientes = getClientes;
