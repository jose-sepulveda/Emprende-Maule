import { Request, Response } from "express";
import sequelize from "../database/connection";
import { Carro } from "../models/carro";
import { Carro_productos } from "../models/carro_productos";
import { Cliente } from "../models/cliente";
import { Productos } from "../models/producto";

export const newCarro = async(req: Request, res: Response) => {
    const { id_cliente, cantidad, cod_producto } = req.body;

    if (!id_cliente || !cantidad || !cod_producto) {
        return res.status(400).json({
            msg: "Faltan datos requeridos",
        })
    }

    const transaccion = await sequelize.transaction();

    try {
        let carro = await Carro.findOne({ where: { id_cliente: id_cliente}});

        if (!carro) {
            carro = await Carro.create({
                "id_cliente": id_cliente,
                "total": 0,
            }, {transaction: transaccion});
        }

        const idCarro = carro.dataValues.id_carro;

        if (cantidad > 0) {
            const productos = await Productos.findOne({ attributes: ['precio_producto', 'descuento', 'precio_descuento', 'cantidad_disponible'], where: {cod_producto: cod_producto}, transaction: transaccion});


            if (!productos) {
                await transaccion.rollback();
                return res.status(400).json({
                    msg: "El producto ingresado no existe",
                })
            }

            const cantidadDisponible = productos.dataValues.cantidad_disponible - cantidad;
            if (cantidadDisponible < 0) {
                await transaccion.rollback();
                return res.status(400).json({
                    msg: "No hay stock suficiente",
                }
                )
            } 

            const precioFinal = productos.dataValues.descuento > 0
                ? productos.dataValues.precio_descuento
                : productos.dataValues.precio_producto;

            const subTotal = precioFinal * cantidad;

            const carroActual = await Carro.findOne({
                attributes: ['total'],
                where: { id_carro: idCarro},
                transaction: transaccion,
            });

            const totalActual = carroActual?.dataValues.total;

            let carroProductos = await Carro_productos.findOne({
                where: { id_carro: idCarro, cod_producto: cod_producto },
                transaction: transaccion,
            });

            if (carroProductos) {
                const cantidadCarroActual = carroProductos.dataValues.cantidad;
                const subtotalCarroActual = carroProductos.dataValues.subtotal;

                await carroProductos.update({
                    cantidad: cantidad + cantidadCarroActual,
                    subtotal: subTotal + subtotalCarroActual,
                }, { transaction: transaccion});

                await Carro.update({
                    total: totalActual + subTotal,
                }, {
                    where: { id_carro: idCarro },
                    transaction: transaccion,
                });
            } else {
                await Carro_productos.create({
                    id_carro: idCarro,
                    cod_producto: cod_producto,
                    cantidad: cantidad,
                    subtotal: subTotal,
                }, { transaction: transaccion });

                await Carro.update({
                    total: totalActual + subTotal,
                }, {
                    where: { id_carro: idCarro},
                    transaction: transaccion,
                })
            }

            await Productos.update({
                cantidad_disponible: cantidadDisponible,
            }, {
                where: { cod_producto: cod_producto },
                transaction: transaccion,
            });

            await transaccion.commit();
            
            return res.status(201).json({
                msg: "Producto ingresado correctamente al carrito",
            });
        } else {
            await transaccion.rollback();
            return res.status(400).json({
                msg: "La cantidad debe ser mayor a 0",
            });
        }

    } catch (error) {
        await transaccion.rollback();
        return res.status(400).json({
            msg: "Ha ocurrido un error al ingresar el producto al carrito",
            error,
        });
    }
};

export const getCarro = async(req: Request, res: Response) => {
    const { id_cliente } = req.params;

    try {
        const carro = await Carro.findOne({ where: {id_cliente: id_cliente}});

        if (!carro) {
            return res.status(404).json({
                msg: "El carro no existe",
            });
        }

        res.json(carro);
    } catch (error) {
        res.status(500).json({
            msg: "Error al obtener el carro",
            error
        });
    }
};

export const getCarros  = async(req: Request, res: Response) => {
    try {
        const listCarros = await Carro.findAll();
        res.json(listCarros);
    } catch(error) {
        res.status(500).json({
            msg: "Error al obtener los carros",
            error
        });
    }
};

export const updateCarro = async(req: Request, res: Response) => {
    const { id_carro } = req.params;
    const { id_cliente } = req.body;

    if (!id_carro || !id_cliente) {
        return res.status(400).json({
            msg: "Faltan datos requeridos"
        });
    }

    const transaccion = await sequelize.transaction();

    try {
        const carro = await Carro.findByPk(id_carro, { transaction: transaccion });

        if (!carro) {
            await transaccion.rollback();
            return res.status(404).json({
                msg: "El carro no existe",
            });
        }

        const cliente = await Cliente.findByPk(id_cliente, { transaction: transaccion });
        if (!cliente) {
            await transaccion.rollback();
            return res.status(400).json({
                msg: "El usuario no existe",
            });
        }

        await carro.update({
            "id_cliente": id_cliente,
        }, {transaction: transaccion});

        await transaccion.commit();

        return res.json({
            msg: "Carro actualizado correctamente",
            carro,
        });
    } catch(error) {
        await transaccion.rollback();
        console.error("Error al actualizar el carro", error);
        return res.status(400).json({
            msg: "Ha ocurrido un error al actualizar la información del carro",
            error
        });
    }
};

export const deletCarro = async(req: Request, res: Response) => {
    const { id_carro } = req.params; 

    if (!id_carro) {
        return res.status(400).json({
            msg: "Falta el id_carro en la solicitud",
        });
    }

    const transaccion = await sequelize.transaction();

    try {
        const carro = await Carro.findByPk(id_carro, { transaction: transaccion });

        if (!carro) {
            await transaccion.rollback();
            return res.status(404).json({
                msg: "El carro no existe",
            });
        }

        await carro.destroy({ transaction: transaccion });

        await transaccion.commit();

        return res.json({
            msg: "Carro eliminado correctamente",
        });

    } catch(error) {
        await transaccion.rollback();
        console.error("Error al eliminar el carro", error);
        return res.status(400).json({
            msg: "Ha ocurrido un error al eliminar el carro",
            error
        });
    }
};