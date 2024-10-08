import { Request, Response } from "express";
import {Cliente} from '../models/cliente';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import {sendEmail} from '../services/mail';

export const newCliente = async(req: Request, res: Response) =>{
    const {rut_cliente, contrasena, nombre_cliente, apellido1_cliente, apellido2_cliente, direccion, telefono, correo} = req.body;
    
    const cliente = await Cliente.findOne({where: {rut_cliente: rut_cliente}})
    const clienteCorreo = await Cliente.findOne({where: {correo: correo}});

    if(cliente){
        return res.status(400).json({
            msg: 'Ya existe un cliente con ese rut'
        })
    }
    if(clienteCorreo){
        return res.status(400).json({
            msg: 'El correo utilizado ya ha sido utilizado'
        })
    }
    
    const hashedPassword = await bcrypt.hash(contrasena, 10)

    try{
        await Cliente.create({
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

        await sendEmail(
            correo,
            'Cuenta Creada',
            `Hola ${nombre_cliente}!. Tu cuenta ha sido creada exitosamente.`
        );

        return res.status(201).json({
            msg: 'Se ha registrado exitosamente'
        })

    } catch (error){
        res.status(400).json({
            msg: 'No se ha podido registrar el cliente',
            error
        })
    }
};

export const deleteCliente = async(req: Request, res: Response) =>{
    const {id_cliente} = req.params;
    const idCliente = await Cliente.findOne({where: {id_cliente: id_cliente}})

    if(!idCliente) {
        return res.status(404).json({
            msg: 'El cliente no existe'
        })
    }
    try{
        await Cliente.destroy({where: {id_cliente: id_cliente}, cascade: true})
        res.json({
            msg: 'El cliente ha sido eliminado'
        })
    }catch (error){
        res.status(400).json({
            msg: 'No se ha podido eliminar el cliente',
            error
        })
    }
};

export const updateCliente = async(req: Request, res: Response) =>{
    const {id_cliente} = req.params;
    const idCliente = await Cliente.findOne({where: {id_cliente: id_cliente}})

    if(!idCliente) {
        return res.status(404).json({
            msg: 'El cliente no existe'
        })
    }
    try{
        const {nombre_cliente, apellido1_cliente, apellido2_cliente, contrasena, direccion, correo, estado_cliente} = req.body;

        if(!contrasena && !nombre_cliente && !apellido1_cliente && !apellido2_cliente && !direccion && !correo && !estado_cliente){
            await Cliente.update({
                estado_cliente: estado_cliente

            }, {where: {id_cliente: id_cliente}
            
        })
        return res.json({
            msg: 'El cliente ha sido actualizado'
        })
    }

        if (contrasena != idCliente?.dataValues.contrasena){
        const hashedPassword = await bcrypt.hash(contrasena, 10)
            await Cliente.update({
                nombre_cliente: nombre_cliente,
                apellido1_cliente: apellido1_cliente,
                apellido2_cliente: apellido2_cliente,
                contrasena: hashedPassword,
                direccion: direccion,
                correo: correo,
                estado_cliente: estado_cliente

            }, {where: {id_cliente: id_cliente}
        })
            return res.json({
                msg: 'El cliente ha sido actualizado'
            })
        } else {
            await Cliente.update({
                nombre_cliente: nombre_cliente,
                apellido1_cliente: apellido1_cliente,
                apellido2_cliente: apellido2_cliente,
                contrasena: contrasena,
                direccion: direccion,
                correo: correo

            }, {where: {id_cliente: id_cliente}
        })
            return res.json({
                msg: 'El cliente ha sido actualizado'
            })
        }
    }catch (error){
        return res.status(400).json({
            msg: 'No se ha podido actualizar el cliente',
            error
        })
    }
};

export const loginCliente = async(req: Request, res: Response) =>{
    const {correo, contrasena} = req.body;

    const cliente: any = await Cliente.findOne({where: {correo: correo}})

    if(!cliente){
        return res.status(401).json({
            msg: 'El correo ingresado no es valido'
        })
    }

    const passwordValida = await bcrypt.compare(contrasena, cliente.contrasena)
    if(!passwordValida) {
        return res.status(401).json({
            msg: 'Contraseña Incorrecta'
        })
    }

    const rol = 'cliente';
    const id_cliente = cliente.dataValues.id_cliente;
    const token = jwt.sign({
        correo: correo,
        role: rol
    }, process.env.SECRET_KEY || 'ACCESS');

    res.json({token, rol: rol, id_cliente: id_cliente})
};

export const resetContrasena = async (req: Request, res: Response) => {
    const { correo, nuevaContrasena} = req.body;

    try {
        const cliente = await Cliente.findOne({ where: { correo: correo } });

        if (!cliente) {
            return res.status(400).json({
                msg: 'No se encontró un cliente con ese correo'
            });
        }

        const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

        await Cliente.update(
            { contrasena: hashedPassword },
            { where: { correo: correo } }
        );

        await sendEmail(
            correo,
            'Contraseña restablecida',
            'Tu contraseña ha sido restablecida exitosamente.'
        );

        return res.status(200).json({
            msg: 'Se ha restablecido la contraseña exitosamente'
        });

    } catch (error) {
        console.error('Error al restablecer la contraseña: ', error);
        return res.status(500).json({
            msg: 'Error al restablecer la contraseña. Inténtalo más tarde.'
        });
    }
};


