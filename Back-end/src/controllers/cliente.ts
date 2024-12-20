import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Cliente } from '../models/cliente';
import { sendEmail } from '../services/mail';

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
        role: rol,
        id_cliente: id_cliente
    }, process.env.SECRET_KEY || 'ACCESS');

    res.json({token, rol: rol, id_cliente: id_cliente})
};

export const recuperarContrasenaCliente = async (req: Request, res: Response) => {
    const { correo } = req.body;

    try {
        const cliente = await Cliente.findOne({ where: { correo } });

        if (!cliente) {
            return res.status(400).json({
                msg: 'No se encontró un cliente con ese correo',
            });
        }

        const token = jwt.sign({correo: cliente.getDataValue("correo"), id_cliente: cliente.getDataValue("id_cliente"), rol: "cliente"}, process.env.SECRET_KEY || 'ACCESS', {expiresIn: '1h' });

        const link = `http://localhost:3001/#/reset-password-cliente/${token}`; 

        await sendEmail(
            correo,
            'Recuperación de contraseña',
            `Haz clic en el siguiente enlace para recuperar tu contraseña: ${link}`
        );

        return res.status(200).json({
            msg: 'Se envió un enlace de recuperación de contraseña a tu correo',
        });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return res.status(500).json({
            msg: 'Error al enviar el correo. Inténtalo más tarde.',
        });
    }
};

export const resetPasswordCliente = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { contrasenaActual, nuevaContrasena } = req.body;

    try {
        const decoded: any = jwt.verify(token, process.env.SECRET_KEY || 'ACCESS');

        const cliente = await Cliente.findOne({ where: { correo: decoded.correo } });

        if (!cliente) {
            return res.status(400).json({
                msg: 'No se encontró un cliente con ese correo',
            });
        }

        const contrasenaActualValida = await bcrypt.compare(contrasenaActual, cliente.getDataValue('contrasena'));

        if (!contrasenaActualValida) {
            return res.status(400).json({
                msg: 'La contraseña actual es incorrecta',
            })
        }

        const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

        await Cliente.update({contrasena: hashedPassword}, {where: { correo: decoded.correo } });

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
        
export const getClienteById = async (req: Request, res: Response) => {
    const { id_cliente} = req.params;

    try{
        const cliente = await Cliente.findOne({where: {id_cliente: id_cliente}});

        if(!cliente){
            return res.status(404).json({
                msg: 'El cliente no existe'
            });
        }

        return res.json(cliente);

    } catch (error) {
        return res.status(500).json({
            msg: 'Error al obtener el cliente',
            error
        });
    }
};

export const getClientes = async (req: Request, res: Response) => {
    try{
        const clientes = await Cliente.findAll();

        if(!clientes || clientes.length === 0) {
            return res.status(404).json({
                msg: 'No hay clientes'
            });
        }

        return res.json(clientes);

    } catch (error) {
        return res.status(500).json({
            msg: 'Error al obtener los clientes',
            error
        });
    }
};




