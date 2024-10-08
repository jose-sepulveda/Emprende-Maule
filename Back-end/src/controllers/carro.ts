import { Request, Response } from "express";
import { Carro } from "../models/carro";
import { Productos } from "../models/producto";

export const newCarro = async(req: Request, res: Response) => {
    const { id_cliente, cantidad, cod_producto } = req.body;

    try {
        let carro = await Carro.findOne({ where: { id_cliente: id_cliente}});

        if (!carro) {
            carro = await Carro.create({
                "id_cliente": id_cliente,
                "total": 0,
            });
        }

        const idCarro = carro.dataValues.id_carro;

        if (cantidad > 0) {
            const idProductos = await Productos.findOne({ attributes: ['']})
        }

    } catch (error) {

    }
}