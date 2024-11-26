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