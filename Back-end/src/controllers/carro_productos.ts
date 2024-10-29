import { Request, Response } from "express";
import sequelize from "../database/connection";
import { Carro } from "../models/carro";
import { Carro_productos } from "../models/carro_productos";
import { Cliente } from "../models/cliente";
import { Productos } from "../models/producto";

export const getCarrosProductos = async(req: Request, res: Response) => {
    try {
        const { id_cliente } = req.params;

        const idCliente = await Cliente.findOne({ where: { id_cliente }});

        if (!idCliente) {
            return res.status(400).json({ msg: "El cliente no existe "});
        }

        let carro = await Carro.findOne({ where: {id_cliente}});
        if (!carro) {
            carro = await Carro.create({ id_cliente, total: 0});
        }

        const carroProductos = await Carro_productos.findAll({
            include: [
                { model: Carro, attributes: ['id_carro'] },
                { model: Productos, attributes: ['nombre_producto', 'precio_producto'] }
            ],
            attributes: ['id_carro_productos', 'cantidad', 'subtotal'],
            where: { id_carro: carro.dataValues.id_carro }
        });

        return res.json(carroProductos);
    } catch(error) {
        console.error('Error al obtener los productos del carro', error);
        return res.status(500).json({error: "Error al obtener los productos del carro"});
    }
};

export const getOneCarroProductos = async(req: Request, res: Response) => {
    const { id_carro_productos } = req.params;

    try {
        const carroProductos = await Carro_productos.findByPk(id_carro_productos, {
            include: [
                { model: Carro, attributes: ['id_carro'] },
                { model: Productos, attributes: ['nombre_producto'] }
            ]
        });

        if (!carroProductos) {
            return res.status(404).json({ error: "Producto no encontrado en el carro"});
        }

        return res.json(carroProductos);
    } catch(error) {
        console.error("Error al obtener el producto del carro", error);
        return res.status(500).json({ error: "Error al obtener el producto del carro."});
    }
};

export const updateCarroProductos = async(req: Request, res: Response) => {
    const { id_carro_productos } = req.params;
    const { id_carro, cod_producto, cantidad, subtotal } = req.body;

    if (!id_carro || !cod_producto || !cantidad || !subtotal) {
        return res.status(400).json({ msg: "Faltan datos requeridos"})
    }

    try {
        const carroProductos = await Carro_productos.findByPk(id_carro_productos);

        if (!carroProductos) {
            return res.status(404).json({ error: "Producto del carrito no encontrado. "});
        }

        await carroProductos.update({
            id_carro,
            cod_producto,
            cantidad,
            subtotal
        });

        return res.json(carroProductos);
    } catch(error) {
        console.error("Error al actualizar el producto del carro: ", error);
        return res.status(500).json({ error: "Error al actualizar el producto del carro."});
    }
};

export const deleteCarroProductos = async(req: Request, res: Response) => {
    const { id_carro_productos } = req.params;

    try {
        const carroProductos = await Carro_productos.findByPk(id_carro_productos);

        if (!carroProductos) {
            return res.status(404).json({ error: "Producto no encontrado en el carro."});
        }

        await carroProductos.destroy();

        return res.json({ msg: "Producto eliminado correctamente del carro. "});
    } catch(error) {
        console.error("Error al eliminar el prodcuto del carro:", error);
        return res.status(500).json({ error: "Error al eliminar producto del carro. "});
    }
};

export const carroLocal= async(req: Request, res: Response) => {
    const { id_cliente, productos } = req.body;

    if (!productos || !Array.isArray(productos)) {
        return res.status(400).json({ error: "Los productos deben ser un array"});
    }

    const transaccion = await sequelize.transaction();

    try {
        let carro = await Carro.findOne({ where: { id_cliente }, transaction: transaccion});
        if (!carro) {
            carro = await Carro.create({ id_cliente }, {transaction: transaccion});
        }

        let totalCarro = carro.dataValues.total || 0; 

        for (const producto of productos) {
            if (!producto.cod_producto || !producto.cantidad) {
                await transaccion.rollback();
                return res.status(400).json({ msg: "Formato de producto incorrecto. Cada producto debe tener 'cod_producto' y 'cantidad'" });
            }
            let carroProductos = await Carro_productos.findOne({
                where: { id_carro: carro?.dataValues.id_carro, cod_producto: producto.cod_producto},
                transaction: transaccion
            });

            let idProducto = await Productos.findOne({ where: { cod_producto: producto.cod_producto}, transaction: transaccion});
            if (!idProducto) {
                await transaccion.rollback();
                return res.status(400).json({ msg: "El producto no existe"});
            }

            const precioFinal = idProducto.dataValues.descuento > 0
                ? idProducto.dataValues.precio_descuento
                : idProducto.dataValues.precio_producto;

            if (carroProductos) {
                let cantidadCarroActual = carroProductos.dataValues.cantidad;
                let subtotalCarroActual = carroProductos.dataValues.subtotal;

                await carroProductos.update({
                    cod_producto: producto.cod_producto,
                    cantidad: producto.cantidad + cantidadCarroActual,
                    subtotal: subtotalCarroActual + (precioFinal * producto.cantidad)
                }, { transaction: transaccion });

                await carroProductos.save({ transaction: transaccion });

                totalCarro += precioFinal * producto.cantidad;
            } else {
                await Carro_productos.create({
                    id_carro: carro?.dataValues.id_carro,
                    cod_producto: producto.cod_producto,
                    cantidad: producto.cantidad,
                    subtotal: producto.cantidad * precioFinal
                }, { transaction: transaccion });

                totalCarro += producto.cantidad * precioFinal
            }
        }

        await carro.update({ total: totalCarro }, { transaction: transaccion });

        await transaccion.commit();
        res.json({ msg: "Carro actualizado correctamente"});
    } catch(error) {
        await transaccion.rollback();
        console.error("Error al actualizar el carro: ", error);
        res.status(500).json({ error: "Error al actualizar el carro"});
    }
};