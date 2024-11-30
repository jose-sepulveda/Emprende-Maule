import { Request, Response } from "express";
import { Contacto } from "../models/contacto";
import { sendEmail } from "../services/mail";


export const sendContactRequest = async (req: Request, res: Response) => {
    const { nombre, correo, categoria_consulta, mensaje } = req.body;

    if (!nombre || !correo || !categoria_consulta || !mensaje) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios'});
    }

    try {
        await Contacto.create({ nombre, correo, categoria_consulta, mensaje });
    
        const soporteCorreo = process.env.SMTP_USER || 'aemprendemaule02@gmail.com';
        const cuerpoMensaje = `Nombre: ${nombre}\nCorreo:${correo}\nMensaje:\n${mensaje}`;
        const correoEnviado = await sendEmail(soporteCorreo, categoria_consulta, cuerpoMensaje);

        if (!correoEnviado) {
            throw new Error('No se pudo enviar el correo al equipo de soporte. ');
       }

       const asunto = 'Hemos recibido tu solicitud de soporte';
       const mensajeUsuario = `Hola ${nombre}, \n \nGracias por contactarnos. Hemos recibido tu mensaje y te responderemos lo antes posible.\n\nDetalles de tu solicitud:\nCategoría: ${categoria_consulta}\nMensaje: ${mensaje}\n\nSaludos,\nEquipo Emprende Maule`;

       await sendEmail(correo, asunto, mensajeUsuario);

       res.status(200).json({ message: 'Solicitud enviada con éxito. Nos pondremos en contacto pronto.' });
    } catch (error) {
        console.error('Error en la solicitud de contacto:', error);
        res.status(500).json({ message: 'Hubo un problema al enviar tu solicitud. Intenta más tarde.' });
    }
}

export const getContactos = async(req: Request, res: Response) => {
    try {
        const contactos = await Contacto.findAll()
        res.json(contactos)
    } catch (error) {
        res.status(500).json({ msg: "Error al obtenner las solicitudes de soporte ", error});
    }
}

export const getOneContacto = async(req: Request, res: Response) => {
    const { id_contacto } = req.params;
    
    try {
        const solicitud = await Contacto.findOne({ where: { id_contacto }});

        if (!solicitud) {
            return res.status(404).json({ msg: "La solicitud no existe" });
        }

        res.json(solicitud);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener la solicitud ", error});
    }
}

export const updateEstadoSolicitud = async(req: Request, res: Response) => {
    const { id_contacto, nuevoEstado } = req.body;
    
    try {
        const solicitud =  await Contacto.findOne({ where: { id_contacto }});

        if (!solicitud) {
            return res.status(404).json({ msg: "La solicitud no existe" });
        }

        if (nuevoEstado === 'Pendiente') {

            await solicitud.update({ estado: nuevoEstado});

            return res.status(200).json({
                msg: 'Estado de la solicitud actualizado a Pendiente y correo enviado',
            });

        }

        if (nuevoEstado === 'Solucionado') {

            await sendEmail(
                solicitud.getDataValue('correo'),
                'Solicitud de Soporte Solucionada',
                `Hola ${solicitud.getDataValue('nombre')}.
                Tu solicitud de soporte ha sido solucionado con exito
                
                ¡¡Gracias por contactarte con nosotros!!
                
                Equipo de Soporte Emprende Maule`);

            await solicitud.update({ estado: nuevoEstado});

            return res.status(200).json({
                msg: 'Estado de la solicitud actualizado a Solucionado y correo enviado',
            });
        }

        return res.status(400).json({msg: 'Estado no valido'});
    } catch (error) {
        console.error('Error al acualizar el estado de la solicitud: ', error);
        return res.status(500).json({
            msg: 'Error al actualizar el estado. Inténtalo más tarde.',
        })
    }
}