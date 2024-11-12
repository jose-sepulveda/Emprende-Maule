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