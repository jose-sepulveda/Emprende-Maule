import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import sequelize from "sequelize";
import { Categorias } from "../models/categoria";
import { Productos } from "../models/producto";
import { uploadPhoToToDrive} from "../services/googleDrive";
import { Emprendedor } from "../models/emprendedor";

export const newProducto = async(req: Request, res: Response) =>{
    const {nombre_producto, precio_producto, descripcion_producto, id_categoria, cantidad_disponible, descuento} = req.body;
    const imagenFile = req.file;

    try{
        if (!imagenFile) {
            return res.status(400).json({ message: "La imagen es requerida" });
        }
        
        const imagePath = path.join(__dirname, '../uploads', imagenFile.filename);
        const imagenId = await uploadPhoToToDrive(imagePath, imagenFile.originalname,'image/jpeg');
        fs.unlinkSync(imagePath);

        let precio_descuento = null;
        if(descuento){
            if(descuento < 0 || descuento > 100){
                return res.status(400).json({ message: 'Descuentro debe ser entre 0 y 100%'});   
        }
        precio_descuento = precio_producto - (precio_producto * (descuento / 100));

    }

        await Productos.create({
            "nombre_producto": nombre_producto,
            "precio_producto": precio_producto,
            "descripcion_producto": descripcion_producto,
            "id_categoria": id_categoria,
            "imagen": imagenId,
            "cantidad_disponible": cantidad_disponible,
            "descuento": descuento || null,
            "precio_descuento": precio_descuento
        });
        return res.status(201).json({
            message: 'Producto creado correctamente'
        });
    }catch(error){
        return res.status(400).json({
            message: 'Ocurrio un error al crear el producto',
            error
        });
    }
};

export const getProducto = async(req: Request, res: Response) =>{
    try{
        const {cod_producto} = req.params;
        const id_categoria = await Productos.findOne({attributes:['id_categoria'],where:{cod_producto: cod_producto}});
        if(!id_categoria){
            return res.status(404).json({
                message: "El producto no existe"
        });
    }
    const producto = await Productos.findOne({attributes:['cod_producto','nombre_producto','precio_producto','descripcion_producto',[sequelize.col('categoria.nombre_categoria'), 'nombre_categoria'],'cantidad_disponible','imagen','cod_producto'],
        include: [
            {
                model: Categorias,
                attributes: [],
            }
        ],
        where: {
            cod_producto: cod_producto
        }
    });
    res.json(producto);
    }catch(error){
        return res.status(400).json({
            message: 'Ocurrio un error al obtener el producto',
            error
        });
    }
};

export const getProductos = async(req: Request, res: Response) =>{
    try{
        const listaProductos = await Productos.findAll({attributes:['cod_producto','nombre_producto','precio_producto','descripcion_producto',[sequelize.col('categoria.nombre_categoria'), 'nombre_categoria'],'cantidad_disponible','imagen','cod_producto'],
        include: [
            {
                model: Categorias,
                attributes: [],
            }
        ]
    });
    res.json(listaProductos);
    }catch(error){
        return res.status(400).json({
            message: 'Ocurrio un error al obtener los productos',
            error
        });
    }
};

export const deleteProducto = async(req: Request, res: Response) =>{
    const {cod_producto} = req.params;
    const idProducto = await Productos.findOne({where: {cod_producto: cod_producto}});
    if(!idProducto){
        return res.status(404).json({
            message: "El producto no existe"
        });
    }
    try{
        await Productos.destroy({where: {cod_producto: cod_producto}});
        return res.json({
            message: 'Producto eliminado correctamente'
        });
    }catch(error){
        return res.status(400).json({
            message: 'Ocurrio un error al eliminar el producto',
            error
        });
    }
};

export const updateProducto = async(req: Request, res: Response) =>{
    const {cod_producto} = req.params;
    const {nombre_producto, precio_producto, descripcion_producto, id_categoria} = req.body;
    const imagen = req.file ? req.file.path : null;

    const idProducto = await Productos.findOne({where: {cod_producto: cod_producto}});
    if(!idProducto){
        return res.status(404).json({
            message: "El producto no existe"
        });
    }
    try{
        if(imagen != null){
            await Productos.update({
                nombre_producto: nombre_producto,
                precio_producto: precio_producto,
                descripcion_producto: descripcion_producto,
                id_categoria: id_categoria,
                },
                {where: {cod_producto: cod_producto}}
            );
            return res.json({
                message: 'Producto actualizado correctamente'
            });
        }else{
            await Productos.update({
                nombre_producto: nombre_producto,
                precio_producto:precio_producto,
                descripcion_producto: descripcion_producto,
                id_categoria: id_categoria
                },
                {where: {cod_producto: cod_producto}}
            );
            return res.json({
                message: 'Producto actualizado correctamente'
            });
        }
        }catch(error){
            return res.status(400).json({
                message: 'Ocurrio un error al actualizar el producto',
                error
            });
        }
};

export const getProductosByCategoria = async(req: Request, res: Response) => {
    const {id_categoria} = req.params;
    try{
        const productos = await Productos.findAll({
            where: {id_categoria: id_categoria},
            attributes: ['cod_producto','nombre_producto','precio_producto','descripcion_producto','cantidad_disponible', 'imagen'],
            include: [{
                model: Categorias,
                attributes: ['nombre_categoria'],
            }]
        });
        if (productos.length === 0) {
            return res.status(404).json({
                message: 'No hay productos en esta categoria'
            });
        }
        res.json(productos);
    } catch (error) {
        res.status(400).json({
            message: 'Ocurrio un error al obtener los productos',
            error
        });
    }
};

export const updateImagen = async (req: Request, res: Response) => {
    const {cod_producto} = req.params;
    const imagenFile = req.file;

    if(!imagenFile) {
        return res.status(400).json({message: "La imagen es requerida "});
    }

    try{
        const producto = await Productos.findOne({ where: {cod_producto} });

        if(!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const imagePath = path.join(__dirname, '../uploads', imagenFile.filename);
        const newImageId = await uploadPhoToToDrive(imagePath, imagenFile.originalname, 'image/jpeg');
        fs.unlinkSync(imagePath);

        await Productos.update({ imagen: newImageId }, { where: {cod_producto} });

        return res.json({ message: "Imagen del producto actualizada correctamente" });
    } catch(error) {
        console.error(error);
        res.status(500).json({
            message: 'Ocurrio un error al actualizar la imagen del producto',
            error
        });
    }
};

export const getProductosByEmprendedor = async (req: Request, res: Response) => {
    const {id_emprendedor} = req.params;

    try{
        const productos = await Productos.findAll({
            where: {id_emprendedor},
            attributes: ['cod_producto','nombre_producto','precio_producto','descripcion_producto','cantidad_disponible', 'imagen'],
            include: [
                {
                    model: Categorias,
                    attributes: ['nombre_categoria'],
                },
                {
                    model: Emprendedor,
                    attributes: ['nombre_emprendedor'],
                }
            ]
        });

        if(!productos || productos.length === 0) {
            return res.status(204).json();
        }

        res.json(productos);

    } catch(error) {
        console.error("Error al consultar productos por emprendedor:", error);
        return res.status(500).json({ message: "Error al consultar productos por emprendedor", error});
    }
};

export const updateProductoConDescuento = async (req: Request, res: Response) => {
    const {cod_producto} = req.params;
    const {precio_producto, descuento} = req.body;

    try {
        if (descuento < 0 || descuento > 100) {
            return res.status(400).json({ message: 'Descuento debe ser entre 0 y 100%' });
        }

        const producto = await Productos.findOne({ where: {cod_producto}});

        if(!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const precioFinal = precio_producto ? precio_producto : producto.get('precio_producto');

        const precio_descuento = precioFinal - (precioFinal * (descuento / 100));

        await Productos.update({
            precio_producto: precioFinal,
            descuento: descuento,
            precio_descuento: precio_descuento
        }, {
            where: {cod_producto}
        });
        
        return res.json({
            message: 'Producto actualizado correctamente',
            data: {
                cod_producto,
                precio_producto: precioFinal,
                descuento,
                precio_descuento
            }
        });

    } catch(error) {
        console.error('Error al actualizar el producto con descuento:', error);
        return res.status(500).json({
            message: 'Ocurrio un error al actualizar el producto con descuento',
            error
        });
    }
};
