import bcrypt from 'bcrypt';
import { Request, RequestHandler, Response } from "express";
import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { Emprendedor } from "../models/emprendedor";
import { deleteFileFromDrive, uploadFileToDrive } from '../services/googleDrive';
import { sendEmail } from '../services/mail';
import { MulterRequest } from '../services/types';

export const getEmprendedores: RequestHandler = async(req: MulterRequest, res: Response): Promise<void> => {
    try{
        const listEmprendedores = await Emprendedor.findAll({
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los emprendedores'})
    }
}

export const crearEmprendedor : RequestHandler = async (req: MulterRequest, res: Response): Promise<void> => {

    try {
        const { rut_emprendedor, contrasena, nombre_emprendedor, apellido1_emprendedor, apellido2_emprendedor, direccion, telefono, correo_electronico, tipo_de_cuenta, numero_de_cuenta} = req.body;

        const emprendedor = await Emprendedor.findOne({ where: {rut_emprendedor: rut_emprendedor}})
        const emprededorCorreo = await Emprendedor.findOne({ where: {correo_electronico: correo_electronico}});

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

        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const files = req.files as { [fieldname: string] : Express.Multer.File[] };

        if (!files?.['comprobante'] || !files?.['imagen_local'] || !files?.['imagen_productos']) {
            res.status(400).json({message: 'Faltan archivos'});
            return;
        }

        const comprobantePath = path.join(__dirname, '../uploads', files['comprobante'][0].filename);
        const imagenLocalPath = path.join(__dirname, '../uploads', files['imagen_local'][0].filename);
        const imagenProductosPath = path.join(__dirname, '../uploads', files['imagen_productos'][0].filename);

        const comprobanteFileId = await uploadFileToDrive(comprobantePath, files['comprobante'][0].originalname, 'aplication/pdf');
        fs.unlinkSync(comprobantePath);
        const imagenLocalFileId = await uploadFileToDrive(imagenLocalPath, files['imagen_local'][0].originalname, 'image/jpeg');
        fs.unlinkSync(imagenLocalPath);
        const imagenProductosFileId = await uploadFileToDrive(imagenProductosPath, files['imagen_productos'][0].originalname, 'image/jpeg');
        fs.unlinkSync(imagenProductosPath);

        const nuevoEmprendedor = await Emprendedor.create({
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
        })
        res.status(201).json({
            message: 'Emprendedor creado exitosamente',
            emprendedor: nuevoEmprendedor,
        });
    } catch (error) {
        console.error('Error al crear el emprendedor:', (error as Error).message);
         res.status(500).json({
          message: 'Error al crear el emprendedor',
          error: (error as Error).message || 'Error desconocido',
        })
    }
}

export const getEmprendedor: RequestHandler = async(req: MulterRequest, res: Response): Promise<void> => {
    const {rut_emprendedor} = req.params;
    const rutEmprendedor = await Emprendedor.findOne({
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
        ], where: {rut_emprendedor: rut_emprendedor}
    }); 
    if (!rutEmprendedor) {
        res.status(404).json({msg: 'El rut de este emprendedor no existe'})
    }
    try {
        res.json(rutEmprendedor);
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error',
            error
        })
    }
}

export const loginEmprendedor = async(req: Request, res: Response) => {
    const { correo_electronico, contrasena} = req.body;

    const emprendedor = await Emprendedor.findOne({where: {correo_electronico: correo_electronico}});

    if (!emprendedor) {
        return res.status(401).json({
            msg: 'El correo ingresado no es valido'
        })
    }

    const emprendedorPassword = await bcrypt.compare(contrasena, emprendedor.dataValues.contrasena);
    if (!emprendedorPassword) {
        return res.status(401).json({
            msg: 'Contraseña Incorrecta'
        })
    }

    const rol = 'emprendedor';
    const id_emprendedor = emprendedor.dataValues.id_emprendedor;
    const token = jwt.sign({
        correo: correo_electronico,
        role: rol
    }, process.env.SECRET_KEY || 'ACCESS');

    res.json({ token, rol: rol, id_emprendedor: id_emprendedor})
}

export const updatePassword = async(req: Request, res: Response) => {

    const {rut_emprendedor, contrasena} = req.body;

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
        const emprendedor = await Emprendedor.findOne({where: {rut_emprendedor: rut_emprendedor}});

        if (!emprendedor) {
            return res.status(404).json({
                msg: 'Emprendedor no encontrado',
            });
        }

        const antigua_contraseña = emprendedor.getDataValue('contrasena');
        const compara_contrasenas = await bcrypt.compare(contrasena, antigua_contraseña);

        if (compara_contrasenas) {
            return res.status(400).json({
                msg: 'La nueva contraseña no puede ser igual al anterior',
            });
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);

        await Emprendedor.update(
            { contrasena: hashedPassword},
            { where: {rut_emprendedor: rut_emprendedor} }
        );

        return res.status(200).json({
            msg: 'Contraseña actualizada correctamente',
        })
    } catch (error) {
        console.error('Error al actualizar la contraseña', error);
        return res.status(500).json({
            msg: 'Error actualizando la contraseña. Intentelo mas tarde',
        })
    }
}

export const updateEmprendedor = async(req: Request, res: Response) => {
    const {rut_emprendedor} = req.params;

    const {
        contrasena,
        nombre_emprendedor,
        apellido1_emprendedor,
        apellido2_emprendedor,
        direccion,
        telefono,
        correo_electronico,
        tipo_de_cuenta,
        numero_de_cuenta,
    } = req.body;

    try {
        const rutEmprendedor = await Emprendedor.findOne({where: {rut_emprendedor: rut_emprendedor}});

        if (!rutEmprendedor) {
            return res.status(404).json({
                msg: 'El rut '+rut_emprendedor+ 'de este emprendedor no existe'
            })
        }

        if (contrasena) {
            const hashedPassword = await bcrypt.hash(contrasena, 10);
            await Emprendedor.update({
                "contrasena": hashedPassword,
                "nombre_emprendedor": nombre_emprendedor,
                "apellido1_emprendedor": apellido1_emprendedor,
                "apellido2_emprendedor": apellido2_emprendedor,
                "direccion": direccion,
                "telefono": telefono,
                "correo_electronico": correo_electronico,
                "tipo_de_cuenta": tipo_de_cuenta,
                "numero_de_cuenta": numero_de_cuenta,
            }, { where: {rut_emprendedor: rut_emprendedor}});

            
            return res.json({msg: 'Se ha actualizado el emprendedor con rut: ', rut_emprendedor});
          } else {
            await Emprendedor.update({
                "nombre_emprendedor": nombre_emprendedor,
                "apellido1_emprendedor": apellido1_emprendedor,
                "apellido2_emprendedor": apellido2_emprendedor,
                "direccion": direccion,
                "telefono": telefono,
                "correo_electronico": correo_electronico,
                "tipo_de_cuenta": tipo_de_cuenta,
                "numero_de_cuenta": numero_de_cuenta,
            }, { where: {rut_emprendedor: rut_emprendedor}});

            
            return res.json({msg: 'Se ha actualizado el emprendedor con rut: ', rut_emprendedor});
          }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error al actualizar el emprendedor'});
    }
}

export const deleteEmprendedor = async(req: Request, res: Response) => {
    const {rut_emprendedor} = req.params;

    try {
        const emprendedor = await Emprendedor.findOne({where: {rut_emprendedor: rut_emprendedor}});
        if (!emprendedor) {
            return res.status(404).json({msg: 'Emprendedor no encontrado'});
        }

        const comprobanteId = emprendedor.getDataValue('comprobante');
        const imagenLocalId = emprendedor.getDataValue('imagen_local');
        const imagenProductosId = emprendedor.getDataValue('imagen_productos');

        if (comprobanteId) {
            await deleteFileFromDrive(comprobanteId);
        }
        if (imagenLocalId) {
            await deleteFileFromDrive(imagenLocalId);
        }
        if (imagenProductosId) {
            await deleteFileFromDrive(imagenProductosId);
        }

        await emprendedor.destroy();

        return res.json({ msg: 'Emprendedor y sus archivos eliminados correctamente'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error eliminando al emprendedor'});
    }
}

export const updateEstadoEmprendedor = async (req: Request, res: Response) => {
    const { rut_emprendedor, nuevoEstado} = req.body;
    console.log("Nuevo estado: ", nuevoEstado);

    try {
        const emprendedor = await Emprendedor.findOne({ where: { rut_emprendedor}});

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

            await sendEmail(
                emprendedor.getDataValue('correo_electronico'),
                'Cuenta Aprobada',
                `Hola ${emprendedor.getDataValue('nombre_emprendedor')}.
                Tu cuenta ha sido aprobada exitosamente.
                ¡Bienvenido a Emprende Maule!`);

            await emprendedor.update({ estado_emprendedor: nuevoEstado});

            return res.status(200).json({
                msg: 'Estado actualizado a Aprovedo y correo enviado',
            });
        }

        if (nuevoEstado == 'Rechazado') {
            await deleteFileFromDrive(emprendedor.getDataValue('comprobante'));
            console.log(`Archivo con ID ${emprendedor.getDataValue('comprobante')} eliminado`);
            await deleteFileFromDrive(emprendedor.getDataValue('imagen_local'));
            console.log(`Archivo con ID ${emprendedor.getDataValue('imagen_local')} eliminado`);
            await deleteFileFromDrive(emprendedor.getDataValue('imagen_productos'));
            console.log(`Archivo con ID ${emprendedor.getDataValue('imagen_productos')} eliminado`);

            await sendEmail(
                emprendedor.getDataValue('correo_electronico'),
                'Cuenta Rechazada',
                `Hola ${emprendedor.getDataValue('nombre_emprendedor')},
                Lamentamos informarte que tu cuenta fue rechazada porque no cumplia con los requisitos para el registro`
            );

            await Emprendedor.destroy({ where: {rut_emprendedor}});

            return res.status(200).json({
                msg: 'Estado actualizado a Rechazado, archivos eliminados y correo enviado',
            });
                
        }

        return res.status(400).json({msg: 'Estado no valido'});
    
    } catch (error) {
        console.error('Error al acualizar el estado del emprendedor: ', error);
        return res.status(500).json({
            msg: 'Error al actualizar el estado. Inténtalo más tarde.',
        })
    }

        
}