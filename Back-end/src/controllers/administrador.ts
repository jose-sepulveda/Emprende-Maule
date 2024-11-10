import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Administrador } from "../models/administrador";
import { sendEmail } from "../services/mail";

export const newAdmin = async(req: Request, res: Response) =>{
    const {rut_administrador, contrasena, nombre_administrador, apellido1_administrador, apellido2_administrador, correo} = req.body;

    const administrador = await Administrador.findOne({where: { rut_administrador: rut_administrador}})

    if (administrador) {
        return res.status(400).json({
            msg: 'El administrador ya existe'
        })
    }

    const hashedpassword = await bcrypt.hash(contrasena, 10)

    try {
        await Administrador.create({
            "rut_administrador": rut_administrador,
            "contrasena": hashedpassword,
            "nombre_administrador": nombre_administrador,
            "apellido1_administrador": apellido1_administrador,
            "apellido2_administrador": apellido2_administrador,
            "correo": correo,
        })
        return res.status(201).json({
            msg: 'Administrador creado exitosamente'
        })

    } catch (error) {
        res.status(400).json({
            msg: 'Error al crear el administrador',
            error
        })
    }
};

export const deleteAdmin = async(req: Request, res: Response) =>{
    const {id_administrador} = req.params;
    const idAdministrador = await Administrador.findOne({where: {id_administrador: id_administrador}})

    if(!idAdministrador){
        return res.status(404).json({
            msg: 'El administrador no existe'
        })
    }

    try{
        await Administrador.destroy({where: {id_administrador: id_administrador}, cascade: true})
        res.json({
            msg: 'El administrador ha sido eliminado'
        })
    }catch (error){
        res.status(400).json({
            msg: 'No se ha podido eliminar el administrador',
            error
        })
    }
};

export const updateAdmin = async (req: Request, res: Response) => {
    const { id_administrador } = req.params;
    const { nombre_administrador, apellido1_administrador, apellido2_administrador, contrasena } = req.body;

    const administrador = await Administrador.findOne({ where: { id_administrador: id_administrador } });

    if (!administrador) {
        return res.status(404).json({
            msg: 'El administrador no existe'
        });
    }

    let hashedpassword;
    if (contrasena) {
        hashedpassword = await bcrypt.hash(contrasena, 10);
    }

    try {
        await administrador.update({
            nombre_administrador,
            apellido1_administrador,
            apellido2_administrador,
            ...(contrasena && { contrasena: hashedpassword })
        });

        res.json({
            msg: 'Administrador actualizado exitosamente'
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Error al actualizar el administrador',
            error
        });
    }
};

export const loginAdmin = async (req: Request, res: Response) => {
    const { correo, contrasena } = req.body;

    const administrador = await Administrador.findOne({ where: { correo } });

    if (!administrador) {
        return res.status(404).json({
            msg: 'El administrador no existe'
        });
    }

    const passwordValida = await bcrypt.compare(contrasena, administrador.dataValues.contrasena);


    if (!passwordValida) {
        return res.status(401).json({
            msg: 'Contraseña Incorrecta'
        });
    }

    const rol = 'administrador';
    const id_administrador = administrador.dataValues.id_administrador;
    const token = jwt.sign({
        correo: correo,
        role: rol,
        id_administrador: id_administrador
    }, process.env.SECRET_KEY || 'ACCESS', {expiresIn: '1h'});

    res.json({ token, rol: rol, id_administrador: id_administrador });
};

export const getAdminById = async (req: Request, res: Response) => {
    const { id_administrador} = req.params;

    try{
        const administrador = await Administrador.findOne({where: {id_administrador: id_administrador}});

        if(!administrador){
            return res.status(404).json({
                msg: 'El administrador no existe'
            });
        }

        return res.json(administrador);

    } catch (error) {
        return res.status(500).json({
            msg: 'Error al obtener el administrador',
            error
        });
    }
};

export const getAdministradores = async (req: Request, res: Response) => {
    try{
        const administradores = await Administrador.findAll();

        if(!administradores || administradores.length === 0) {
            return res.status(404).json({
                msg: 'No hay administradores'
            });
        }

        return res.json(administradores);

    } catch (error) {
        return res.status(500).json({
            msg: 'Error al obtener los administradores',
            error
        });
    }
};

export const recuperarContrasena = async (req: Request, res: Response) => {
    const { correo } = req.body;

    try{
        const administrador = await Administrador.findOne({where: {correo}});

        if(!administrador){
            return res.status(400).json({
                msg: 'No se encontró un administrador con ese correo'
            });
        }

        const token = jwt.sign({correo: administrador.getDataValue("correo"), id_administrador: administrador.getDataValue("id_administrador"), rol: "administrador"}, process.env.SECRET_KEY || 'ACCESS', {expiresIn: '1h'});

        const link = `http://localhost:3001/#/reset-password/${token}`;

        await sendEmail(
            correo,
            'Recuperación de contraseña',
            `Haz clic en el siguiente enlace para recuperar tu contraseña: ${link}`
        );

        return res.status(200).json({
            msg: 'Se envió un enlace de recuperación de contraseña a tu correo'
        });

    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return res.status(500).json({
            msg: 'Error al enviar el correo. Inténtalo más tarde.',
        });
    }
};

export const resetPasswordAdmin = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { contrasenaActual, nuevaContrasena} = req.body;

    try{
        const decoded: any = jwt.verify(token, process.env.SECRET_KEY || 'ACCESS');

        const administrador = await Administrador.findOne({where: {correo: decoded.correo}});

        if (!administrador) {
            return res.status(400).json({
                msg: 'No se encontró un administrador con ese correo',
            });
        }

        const contrasenaActualValida = await bcrypt.compare(contrasenaActual, administrador.getDataValue('contrasena'));

        if (!contrasenaActualValida) {
            return res.status(400).json({
                msg: 'La contraseña actual es incorrecta',
            })
        }

        const hashedPassword = await bcrypt.hash(nuevaContrasena,10);

        await Administrador.update({contrasena: hashedPassword}, {where: { correo: decoded.correo }});

        await sendEmail(
            decoded.correo,
            'Contraseña restablecida',
            'Tu contraseña ha sido restablecida exitosamente.'
        );

        return res.status(200).json({
            msg: 'Se ha restablecido la contraseña exitosamente',
        });

    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        return res.status(500).json({
            msg: 'Error al restablecer la contraseña. Inténtalo más tarde.',
        });
    }
};
