import { Request, Response } from "express";
import { Ventas } from "../models/ventas";
import { Productos } from "../models/producto";

export const getVentas = async(req: Request, res: Response) => {
    try {
        const listVentas = await Ventas.findAll();
        res.json(listVentas);
    } catch(error) {
        res.status(500).json({
            msg: "Error al obtener las ventas",
            error
        });
    }
};

export const getVenta = async(req: Request, res: Response) => {
    const { id_venta } = req.params;
    try {
        const idVenta = await Ventas.findOne({where: {id_venta: id_venta}})
        if(!idVenta){
            return res.status(404).json({
                msg: "La venta no existe"
            });
        }
        res.json(idVenta);
    } catch(error) {
        return res.status(400).json({
            msg: "Error al obtener la venta",
            error
        })
    }
};



    
