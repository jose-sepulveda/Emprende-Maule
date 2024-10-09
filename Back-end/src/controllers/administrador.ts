import { Request, Response } from "express";
import { Administrador } from "../models/administrador";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import sequelize from "sequelize";

export const newAdmin = async(req: Request, res: Response) =>{
    const {rut_administrador, contrasena, nombre_administrador, apellido1_administrador, apellido2_administrador} = req.body;

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
            "apellido2_administrador": apellido2_administrador
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
    const { rut_administrador, contrasena } = req.body;

    const administrador = await Administrador.findOne({ where: { rut_administrador: rut_administrador } });

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
        rut_administrador: rut_administrador,
        role: rol
    }, process.env.SECRET_KEY || 'ACCESS', {expiresIn: '1h'});

    res.json({ token, rol: rol, id_administrador: id_administrador });
};
  

