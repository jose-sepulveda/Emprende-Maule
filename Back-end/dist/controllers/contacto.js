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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEstadoSolicitud = exports.getOneContacto = exports.getContactos = exports.sendContactRequest = void 0;
const contacto_1 = require("../models/contacto");
const mail_1 = require("../services/mail");
const sendContactRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, correo, categoria_consulta, mensaje } = req.body;
    if (!nombre || !correo || !categoria_consulta || !mensaje) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    try {
        yield contacto_1.Contacto.create({ nombre, correo, categoria_consulta, mensaje });
        const soporteCorreo = process.env.SMTP_USER || 'aemprendemaule02@gmail.com';
        const cuerpoMensaje = `Nombre: ${nombre}\nCorreo:${correo}\nMensaje:\n${mensaje}`;
        const correoEnviado = yield (0, mail_1.sendEmail)(soporteCorreo, categoria_consulta, cuerpoMensaje);
        if (!correoEnviado) {
            throw new Error('No se pudo enviar el correo al equipo de soporte. ');
        }
        const asunto = 'Hemos recibido tu solicitud de soporte';
        const mensajeUsuario = `Hola ${nombre}, \n \nGracias por contactarnos. Hemos recibido tu mensaje y te responderemos lo antes posible.\n\nDetalles de tu solicitud:\nCategoría: ${categoria_consulta}\nMensaje: ${mensaje}\n\nSaludos,\nEquipo Emprende Maule`;
        yield (0, mail_1.sendEmail)(correo, asunto, mensajeUsuario);
        res.status(200).json({ message: 'Solicitud enviada con éxito. Nos pondremos en contacto pronto.' });
    }
    catch (error) {
        console.error('Error en la solicitud de contacto:', error);
        res.status(500).json({ message: 'Hubo un problema al enviar tu solicitud. Intenta más tarde.' });
    }
});
exports.sendContactRequest = sendContactRequest;
const getContactos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactos = yield contacto_1.Contacto.findAll();
        res.json(contactos);
    }
    catch (error) {
        res.status(500).json({ msg: "Error al obtenner las solicitudes de soporte ", error });
    }
});
exports.getContactos = getContactos;
const getOneContacto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_contacto } = req.params;
    try {
        const solicitud = yield contacto_1.Contacto.findOne({ where: { id_contacto } });
        if (!solicitud) {
            return res.status(404).json({ msg: "La solicitud no existe" });
        }
        res.json(solicitud);
    }
    catch (error) {
        res.status(500).json({ msg: "Error al obtener la solicitud ", error });
    }
});
exports.getOneContacto = getOneContacto;
const updateEstadoSolicitud = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_contacto, nuevoEstado } = req.body;
    try {
        const solicitud = yield contacto_1.Contacto.findOne({ where: { id_contacto } });
        if (!solicitud) {
            return res.status(404).json({ msg: "La solicitud no existe" });
        }
        if (nuevoEstado === 'Pendiente') {
            yield solicitud.update({ estado: nuevoEstado });
            return res.status(200).json({
                msg: 'Estado de la solicitud actualizado a Pendiente y correo enviado',
            });
        }
        if (nuevoEstado === 'Solucionado') {
            yield (0, mail_1.sendEmail)(solicitud.getDataValue('correo'), 'Solicitud de Soporte Solucionada', `Hola ${solicitud.getDataValue('nombre')}.
                Tu solicitud de soporte ha sido solucionado con exito
                
                ¡¡Gracias por contactarte con nosotros!!
                
                Equipo de Soporte Emprende Maule`);
            yield solicitud.update({ estado: nuevoEstado });
            return res.status(200).json({
                msg: 'Estado de la solicitud actualizado a Solucionado y correo enviado',
            });
        }
        return res.status(400).json({ msg: 'Estado no valido' });
    }
    catch (error) {
        console.error('Error al acualizar el estado de la solicitud: ', error);
        return res.status(500).json({
            msg: 'Error al actualizar el estado. Inténtalo más tarde.',
        });
    }
});
exports.updateEstadoSolicitud = updateEstadoSolicitud;
