import { Request, Response } from "express";
import { Ventas } from "../models/ventas";
import { Productos } from "../models/producto";
import { Carro_productos } from "../models/carro_productos";
import { Carro } from "../models/carro";
import { Venta_productos } from "../models/venta_productos";
import { Cliente } from "../models/cliente";
import { Emprendedor } from "../models/emprendedor";
import { Pedidos } from "../models/pedidos";


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

export const getVentaCliente = async(req: Request, res: Response) => {
    const { id_cliente } = req.params;
    try{
        const listVentas = await Ventas.findAll({where: {id_cliente: id_cliente}});
        res.json(listVentas)
    } catch(error) {
        console.error(error);
        res.status(500).json({
            msg: "Error al obtener las ventas del cliente",
            error
        })
    }
};

export const createVenta = async (req: Request, res: Response) => {
    const { id_cliente } = req.params;
    const { metodo_de_pago } = req.body;

    try{
        if (!metodo_de_pago || typeof metodo_de_pago !== "string" || metodo_de_pago.trim () === "") {
            return res.status(400).json({ msg: "El método de pago es obligatorio" });
            
        }

        const idCliente = await Cliente.findOne({ where: { id_cliente }});
        if (!idCliente) {
            return res.status(400).json({ msg: `El cliente ${id_cliente} no existe`});
        }

        //if (!idCliente.dataValues.estado_cliente) {
            //return res.json({ msg: "Debes realizar el pago del carrito primero" });
        //}

        const fechaActual = new Date();
        //const dia = fechaActual.getDate();
        //const mes = fechaActual.getMonth() + 1;
        //const anio = fechaActual.getFullYear();
        //const hora = fechaActual.getHours();
        const fechaFormateada = fechaActual.toISOString().split('T')[0];

        const venta = await Ventas.create({
            id_cliente: id_cliente,
            fecha_venta: fechaFormateada,
            subtotal: 0,
            iva: 0,
            descuentos: 0,
            total: 0,
            metodo_de_pago: metodo_de_pago.trim()
        });

        const carroCliente = await Carro.findOne({where: { id_cliente }});
        const idCarroCliente = carroCliente?.dataValues.id_carro;
        const listCarroProductos = await Carro_productos.findAll({ where: { id_carro: idCarroCliente} });

        if (!listCarroProductos || listCarroProductos.length === 0) {
            return res.json({ msg: "No hay productos en el carrito" });
        } 

        let subtotalVenta = 0;

        for (const carroProductos of listCarroProductos) {
            const { cod_producto, cantidad, subtotal } = carroProductos.dataValues;
            const idVenta = venta.dataValues.id_venta;

            const producto = await Productos.findOne({ where: {cod_producto} });
            if(!producto) {
                continue;
            }

            const idEmprendendor = producto.dataValues.id_emprendedor;

            const pedido =await Pedidos.create({
                cod_producto,
                id_venta: idVenta,
                id_cliente: id_cliente,
                id_emprendedor: idEmprendendor,
                estado_pedido: "Pendiente",
                id_venta_productos: null
            });

            const ventaProducto = await Venta_productos.create({
                id_venta: idVenta,
                cod_producto,
                cantidad,
                subtotal
            });

            await pedido.update({
                id_venta_productos: ventaProducto.dataValues.id_venta_productos

            });

            subtotalVenta += subtotal;

            
            
            const cantidadActual = producto.dataValues.cantidad_disponible - cantidad;
            await producto.update({ cantidad_disponible: cantidadActual});
            await carroProductos.destroy();
        }

        await Carro.update({ total: 0}, { where: { id_cliente } });

        //const listVentaProductos = await Venta_productos.findAll({ where: { id_venta: venta.dataValues.id_venta} });
        //let subtotalVenta = 0;

        //for (const ventasProducto of listVentaProductos) {
            //const subtotalProducto = ventasProducto.dataValues.subtotal || 0;
            //subtotalVenta += subtotalProducto;
        //}

        const iva = subtotalVenta * 0.19;
        const total = subtotalVenta + iva;

        await venta.update({
            estado_de_venta: true,
            subtotal: subtotalVenta,
            iva : iva,
            total: total
        });

        return res.status(201).json({ 
            msg: "Venta y pedidos creados correctamente",
            venta: {
                id_venta: venta.dataValues.id_venta,
                total: total,
                subtotal: subtotalVenta,
                iva: iva,
                metodo_de_pago: metodo_de_pago.trim(),
                fecha_venta: venta.dataValues.fecha_venta.toISOString().split('T')[0],
            }
        });
    } catch (error) {
        return res.status(400).json({
            msg: "Error al realizar la venta y crear pedidos",
            error
        });
    }
}

export const deleteVenta = async (req: Request, res: Response) => {
    const { id_venta } = req.params;
    const venta = await Ventas.findByPk(id_venta);

    if (!venta) {
        return res.status(404).json({
            msg: "La venta no existe",
        });
    }

    try {

        await venta.destroy();

        res.json({
            msg: "Venta eliminada correctamente",
        });
    } catch (error) {
        return res.status(400).json({
            msg: "Error al eliminar la venta",
            error,
        });
    }
};


    
