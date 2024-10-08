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
exports.getClientes = exports.getClienteById = exports.resetContrasena = exports.loginCliente = exports.updateCliente = exports.deleteCliente = exports.newCliente = void 0;
const cliente_1 = require("../models/cliente");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
        role: rol
    }, process.env.SECRET_KEY || 'ACCESS');
    res.json({ token, rol: rol, id_cliente: id_cliente });
});
exports.loginCliente = loginCliente;
const resetContrasena = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, nuevaContrasena } = req.body;
    try {
        const cliente = yield cliente_1.Cliente.findOne({ where: { correo: correo } });
        if (!cliente) {
            return res.status(400).json({
                msg: 'No se encontró un cliente con ese correo'
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(nuevaContrasena, 10);
        yield cliente_1.Cliente.update({ contrasena: hashedPassword }, { where: { correo: correo } });
        yield (0, mail_1.sendEmail)(correo, 'Contraseña restablecida', 'Tu contraseña ha sido restablecida exitosamente.');
        return res.status(200).json({
            msg: 'Se ha restablecido la contraseña exitosamente'
        });
    }
    catch (error) {
        console.error('Error al restablecer la contraseña: ', error);
        return res.status(500).json({
            msg: 'Error al restablecer la contraseña. Inténtalo más tarde.'
        });
    }
});
exports.resetContrasena = resetContrasena;
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
