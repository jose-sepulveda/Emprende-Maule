import { Request, Response } from "express";
import { Resena } from "../models/resena"; 
import { Cliente } from "../models/cliente";
import { Productos } from "../models/producto";

export const crearResena = async(req: Request, res: Response) => {

    const { calificación, resena, id_cliente, cod_producto } = req.body;

    if (calificación < 1 || calificación > 5) {
        return res.status(400).json({
            message: 'La calificación debe estar entre 1 y 5'
        });
    }

    try {

        const cliente = await Cliente.findByPk(id_cliente, {
            attributes: ['nombre_cliente', 'apellido1_cliente', 'apellido2_cliente']
        });

        if (!cliente) {
            return res.status(404).json({
                message: 'Cliente no encontrado'
            });
        }

        const nuevaResena = await Resena.create({
            "calificación": calificación,
            "resena": resena,
            "id_cliente": id_cliente,
            "cod_producto": cod_producto
        });

        return res.status(201).json({
            message: 'Reseña creada con éxito',
            resena: nuevaResena,
            cliente: {
                nombre: cliente.getDataValue("nombre_cliente"),
                apellido1: cliente.getDataValue("apellido1_cliente"),
                apellido2: cliente.getDataValue("apellido2_cliente")
            }
        });

    } catch (error) {
        res.status(400).json({
            message: 'Ocurrió un error al crear la reseña',
            error
        });
    }
};

export const actualizarResena = async(req: Request, res: Response) => {
    const { id_resena } = req.params;
    const { calificación, resena } = req.body;

    if (calificación < 1 || calificación > 5) {
        return res.status(400).json({
            message: 'La calificación debe estar entre 1 y 5'
        });
    }

    const idResena = await Resena.findOne({ where: { id_resena: id_resena } });
    if (!idResena) {
        return res.status(404).json({
            message: 'Reseña no encontrada'
        });
    }
    try {
        await Resena.update({
            calificación: calificación,
            resena: resena
        }, 
        { where: { id_resena: id_resena } });
        
        return res.status(201).json({
            message: 'Reseña actualizada con éxito'
        });
    } catch (error) {
        res.status(400).json({
            message: 'Ocurrió un error al actualizar la reseña',
            error
        });
    }
};

export const eliminarResena = async(req: Request, res: Response) => {
    const { id_resena } = req.params;
    const idResena = await Resena.findOne({ where: { id_resena: id_resena } });
    if (!idResena) {
        return res.status(404).json({
            message: 'Reseña no encontrada'
        });
    }
    try {
        await Resena.destroy({ where: { id_resena: id_resena } });
        return res.json({
            message: 'Reseña eliminada con éxito'
        });

    } catch (error) {
        res.status(400).json({
            message: 'Ocurrió un error al eliminar la reseña',
            error
        });
    }
};

export const consultarResenaCliente = async(req: Request, res: Response) => {
    const { id_cliente } = req.params;

    try {
        const resenas = await Resena.findAll({
            where: { id_cliente: id_cliente },
            include: [{ model: Cliente, attributes: ['nombre_cliente', 'apellido1_cliente', 'apellido2_cliente'] }]
        });

        if (resenas.length === 0) {
            return res.status(404).json({
                message: 'Reseñas no encontradas'
            });
        }

        return res.json(resenas);

    } catch (error) {
        res.status(500).json({
            message: 'Ocurrió un error al consultar las reseñas',
            error
        });
    }
};

export const consultarResenaProducto = async(req: Request, res: Response) => {
    const { cod_producto } = req.params;

    try {
        const resenas = await Resena.findAll({
            where: { cod_producto: cod_producto },
            include: [{ model: Productos, attributes: ['nombre_producto'] }]
        });

        if (resenas.length === 0) {
            return res.status(404).json({
                message: 'Reseñas no encontradas'
            });
        }

        return res.json(resenas);

    } catch (error) {
        res.status(500).json({
            message: 'Ocurrió un error al consultar las reseñas',
            error
        });
    }
};
