import { Request, Response } from "express";
import { Pedidos } from "../models/pedidos";
import { Ventas } from "../models/ventas";
import { Productos } from "../models/producto";
import { Emprendedor } from "../models/emprendedor";
import { Cliente } from "../models/cliente";

export const getPedidos = async(req: Request, res: Response) => {
    try {
        const pedidos = await Pedidos.findAll();
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener los pedidos", error });
    }
};

export const getPedido = async(req: Request, res: Response) => {
    const { id_pedido } = req.params;
    try {
        const pedido = await Pedidos.findOne({ 
            where: { id_pedido},
            include: [
                { model: Cliente, attributes: ['nombre_cliente', 'apellido1_cliente', 'apellido2_cliente', 'direccion', 'telefono']},
                { model: Productos, attributes: ['nombre_producto', 'id_emprendedor'] },
                { model: Emprendedor, attributes: ['nombre_emprendedor', 'apellido1_emprendedor', 'apellido2_emprendedor', 'direccion', 'telefono', 'correo_electronico' ] }
            ]
        });
        if (!pedido) {
            return res.status(404).json({ msg: "El pedido no existe" });
        }
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener el pedido", error });
    }
};

export const getPedidoByCliente = async(req: Request, res: Response) => {
    const { id_cliente } = req.params;
    try {
        const pedidos = await Pedidos.findAll({ 
            where: { id_cliente },
            include: [
                { 
                    model: Ventas,
                    where: { id_cliente },
                    include: [
                        {
                            model: Productos,
                            attributes: ['nombre_producto', 'descripcion_producto', 'id_categoria']
                        },
                    ],
                },
            ],
        });
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener los pedidos del cliente", error });
    }
};

export const getPedidoByEmprendedor = async(req: Request, res: Response) => {
    const { id_emprendedor } = req.params;
    try {
        const pedidos = await Pedidos.findAll({
            where: { id_emprendedor },
            include: [{ model: Productos }, { model: Cliente }]
        });
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener los pedidos del emprendedor", error });
    }
};

export const updateEstadoPedido = async(req: Request, res: Response) => {
    const {id_pedido} = req.params;
    const { estado_pedido } = req.body;

    try {
        const pedido = await Pedidos.findByPk(id_pedido);
        if (!pedido) {
            return res.status(404).json({ msg: "El pedido no existe" });
        }
        await pedido.update({ estado_pedido });
        res.json({ msg: "Estado del pedido actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar el estado del pedido", error });
    }
};