import bcrypt from 'bcrypt';
import { RequestHandler, Response } from "express";
import fs from 'fs';
import path from 'path';
import { Emprendedor } from "../models/emprendedor";
import { MulterRequest } from '../services/types';
import { uploadFileToDrive } from './googleDrive';

export const crearEmprendedor : RequestHandler = async (req: MulterRequest, res: Response): Promise<void> => {

    try {
        const { rut_emprendedor, contrasena, nombre_emprendedor, apellido1_emprendedor, apellido2_emprendedor, direccion, telefono, correo_electronico, tipo_de_cuenta, numero_de_cuenta, estado_emprendedor} = req.body;

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
            "estado_emprendedor": estado_emprendedor,
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