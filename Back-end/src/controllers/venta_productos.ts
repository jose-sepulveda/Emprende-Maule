import {Request, Response} from "express";
import { Venta_productos } from "../models/venta_productos";


export const deleteVentaProducto = async (req: Request, res: Response) => {
    const { id_venta_productos } = req.params;
    const idVentaProducto = await Venta_productos. findOne({where: {id_venta_productos: id_venta_productos}})
    if (!idVentaProducto) {
        return res.status(404).json({message: 'Venta producto no encontrado'})
    }
    try{
        await Venta_productos.destroy({where: {id_venta_productos: id_venta_productos}}
        )
        return res.json({
            msg: 'Venta producto eliminado con exito',
        })
        } catch (error) {
            return res.status(400).json({
                msg: 'Error al eliminar venta producto',
                error
            })
    }

}

export const updateVentaProducto = async(req: Request, res: Response) => {
    const { id_venta_productos } = req.params;
    const { id_venta, cod_producto, cantidad} = req.body;
    const idVentaProducto = await Venta_productos.findOne({where: {id_venta_productos: id_venta_productos}})
    if (!idVentaProducto) {
        return res.status(404).json({msg: 'El id del detalle de venta no existe'})
    }
    try{
        await Venta_productos.update({
            id_venta: id_venta,
            cod_producto: cod_producto,
            cantidad: cantidad
            },
            {where: {id_venta_productos: id_venta_productos}}
        )
        return res.json({
            msg: 'Detalle de venta ' + id_venta_productos + ' actualizado correctamente'
        })
        } catch (error) {
            return res.status(400).json({
                msg: 'Error al actualizar el detalle de venta',
                error
        })
    }
};

export const getVentaProductos = async(req: Request, res: Response) => {
    try {
        const listVentaProductos = await Venta_productos.findAll();
        res.json(listVentaProductos);
    } catch(error) {
        res.status(500).json({
            msg: "Error al obtener los detalles de ventas",
            error
        });
    }
};

export const getVentaProductosVenta = async(req: Request, res: Response) => {
    const { id_venta } = req.params;
    try {
        const listVentaProductos = await Venta_productos.findAll({where: {id_venta: id_venta}});
        res.json(listVentaProductos);
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los detalles de ventas de esa venta." });
    }
};

export const getVentaProducto = async(req: Request, res: Response) => {
    const { id_venta_productos } = req.params;
    try {
        const ventaProducto = await Venta_productos.findOne({where: {id_venta_productos: id_venta_productos}});
        if (!ventaProducto) {
            return res.status(404).json({
                msg: "El detalle de venta no existe"
            });
        }
        res.json(ventaProducto);
        } catch(error) {
            res.status(500).json({
                msg: "Error al obtener el detalle de venta",
            error
        });
    }
};