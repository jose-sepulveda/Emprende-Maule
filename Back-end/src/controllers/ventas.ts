import { Request, Response } from "express";
import { Ventas } from "../models/ventas";
import { Productos } from "../models/producto";
import { Carro_productos } from "../models/carro_productos";
import { Carro } from "../models/carro";
import { Venta_productos } from "../models/venta_productos";
import { Cliente } from "../models/cliente";


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

    try{
        const idCliente = await Cliente.findOne({ where: { id_cliente }});
        if (!idCliente) {
            return res.status(400).json({ msg: `El cliente ${id_cliente} no existe`});
        }

        //if (!idCliente.dataValues.estado_cliente) {
            //return res.json({ msg: "Debes realizar el pago del carrito primero" });
        //}

        const fechaActual = new Date();
        const dia = fechaActual.getDate();
        const mes = fechaActual.getMonth() + 1;
        const anio = fechaActual.getFullYear();
        //const hora = fechaActual.getHours();
        const fechaFormateada = `${dia}/${mes}/${anio}`;

        const venta = await Ventas.create({
            id_cliente: id_cliente,
            fecha_venta: fechaFormateada,
            subtotal: 0,
            iva: 0,
            descuentos: 0,
            total: 0,
            metodo_de_pago: " "
        });

        const carroCliente = await Carro.findOne({where: { id_cliente }});
        const idCarroCliente = carroCliente?.dataValues.id_carro;
        const listCarroProductos = await Carro_productos.findAll({ where: { id_carro: idCarroCliente} });

        if (!listCarroProductos || listCarroProductos.length === 0) {
            return res.json({ msg: "No hay productos en el carrito" });
        } 

        for (const carroProductos of listCarroProductos) {
            const { cod_producto, cantidad } = carroProductos.dataValues;
            const idVenta = venta.dataValues.id_venta;

            await Venta_productos.create({
                id_venta: idVenta,
                cod_producto,
                cantidad
            });

            const producto = await Productos.findOne({ where: {cod_producto} });
            if(producto) {
                const cantidadActual = producto.dataValues.cantidad_disponible - cantidad;
                await producto.update({ cantidad_disponible: cantidadActual});
            }
            await carroProductos.destroy();
        }

        await Carro.update({ total: 0}, { where: { id_cliente } });

        const listVentaProductos = await Venta_productos.findAll({ where: { id_venta: venta.dataValues.id_venta} });
        let subtotalVenta = 0;

        for (const ventasProducto of listVentaProductos) {
            const subtotalProducto = ventasProducto.dataValues.subtotal || 0;
            subtotalVenta += subtotalProducto;
        }

        const iva = subtotalVenta * 0.19;
        const total = subtotalVenta + iva;

        await venta.update({
            estado_de_venta: true,
            subtotal: subtotalVenta,
            iva : iva,
            total: total
        });

        return res.status(201).json({ 
            msg: "Venta realizada correctamente",
            venta: {
                id_venta: venta.dataValues.id_venta,
                total: total,
                subtotal: subtotalVenta,
                iva: iva,
                fecha_venta: venta.dataValues.fecha_venta,
            }
        });
    } catch (error) {
        return res.status(400).json({
            msg: "Error al realizar la venta",
            error
        });
    }
};


    
