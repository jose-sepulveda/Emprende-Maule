"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductoConDescuento = exports.getProductosByEmprendedor = exports.updateImagen = exports.getProductosByCategoria = exports.updateProducto = exports.deleteProducto = exports.getProductos = exports.getProducto = exports.newProducto = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sequelize_1 = __importDefault(require("sequelize"));
const categoria_1 = require("../models/categoria");
const producto_1 = require("../models/producto");
const googleDrive_1 = require("../services/googleDrive");
const emprendedor_1 = require("../models/emprendedor");
const newProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre_producto, precio_producto, descripcion_producto, id_categoria, cantidad_disponible, descuento } = req.body;
    const imagenFile = req.file;
    try {
        if (!imagenFile) {
            return res.status(400).json({ message: "La imagen es requerida" });
        }
        const imagePath = path_1.default.join(__dirname, '../uploads', imagenFile.filename);
        const imagenId = yield (0, googleDrive_1.uploadPhoToToDrive)(imagePath, imagenFile.originalname, 'image/jpeg');
        fs_1.default.unlinkSync(imagePath);
        let precio_descuento = null;
        if (descuento) {
            if (descuento < 0 || descuento > 100) {
                return res.status(400).json({ message: 'Descuentro debe ser entre 0 y 100%' });
            }
            precio_descuento = precio_producto - (precio_producto * (descuento / 100));
        }
        yield producto_1.Productos.create({
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
    }
    catch (error) {
        return res.status(400).json({
            message: 'Ocurrio un error al crear el producto',
            error
        });
    }
});
exports.newProducto = newProducto;
const getProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cod_producto } = req.params;
        const id_categoria = yield producto_1.Productos.findOne({ attributes: ['id_categoria'], where: { cod_producto: cod_producto } });
        if (!id_categoria) {
            return res.status(404).json({
                message: "El producto no existe"
            });
        }
        const producto = yield producto_1.Productos.findOne({ attributes: ['cod_producto', 'nombre_producto', 'precio_producto', 'descripcion_producto', [sequelize_1.default.col('categoria.nombre_categoria'), 'nombre_categoria'], 'cantidad_disponible', 'imagen', 'cod_producto'],
            include: [
                {
                    model: categoria_1.Categorias,
                    attributes: [],
                }
            ],
            where: {
                cod_producto: cod_producto
            }
        });
        res.json(producto);
    }
    catch (error) {
        return res.status(400).json({
            message: 'Ocurrio un error al obtener el producto',
            error
        });
    }
});
exports.getProducto = getProducto;
const getProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listaProductos = yield producto_1.Productos.findAll({ attributes: ['cod_producto', 'nombre_producto', 'precio_producto', 'descripcion_producto', [sequelize_1.default.col('categoria.nombre_categoria'), 'nombre_categoria'], 'cantidad_disponible', 'imagen', 'cod_producto'],
            include: [
                {
                    model: categoria_1.Categorias,
                    attributes: [],
                }
            ]
        });
        res.json(listaProductos);
    }
    catch (error) {
        return res.status(400).json({
            message: 'Ocurrio un error al obtener los productos',
            error
        });
    }
});
exports.getProductos = getProductos;
const deleteProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cod_producto } = req.params;
    const idProducto = yield producto_1.Productos.findOne({ where: { cod_producto: cod_producto } });
    if (!idProducto) {
        return res.status(404).json({
            message: "El producto no existe"
        });
    }
    try {
        yield producto_1.Productos.destroy({ where: { cod_producto: cod_producto } });
        return res.json({
            message: 'Producto eliminado correctamente'
        });
    }
    catch (error) {
        return res.status(400).json({
            message: 'Ocurrio un error al eliminar el producto',
            error
        });
    }
});
exports.deleteProducto = deleteProducto;
const updateProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cod_producto } = req.params;
    const { nombre_producto, precio_producto, descripcion_producto, id_categoria } = req.body;
    const imagen = req.file ? req.file.path : null;
    const idProducto = yield producto_1.Productos.findOne({ where: { cod_producto: cod_producto } });
    if (!idProducto) {
        return res.status(404).json({
            message: "El producto no existe"
        });
    }
    try {
        if (imagen != null) {
            yield producto_1.Productos.update({
                nombre_producto: nombre_producto,
                precio_producto: precio_producto,
                descripcion_producto: descripcion_producto,
                id_categoria: id_categoria,
            }, { where: { cod_producto: cod_producto } });
            return res.json({
                message: 'Producto actualizado correctamente'
            });
        }
        else {
            yield producto_1.Productos.update({
                nombre_producto: nombre_producto,
                precio_producto: precio_producto,
                descripcion_producto: descripcion_producto,
                id_categoria: id_categoria
            }, { where: { cod_producto: cod_producto } });
            return res.json({
                message: 'Producto actualizado correctamente'
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: 'Ocurrio un error al actualizar el producto',
            error
        });
    }
});
exports.updateProducto = updateProducto;
const getProductosByCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_categoria } = req.params;
    try {
        const productos = yield producto_1.Productos.findAll({
            where: { id_categoria: id_categoria },
            attributes: ['cod_producto', 'nombre_producto', 'precio_producto', 'descripcion_producto', 'cantidad_disponible', 'imagen'],
            include: [{
                    model: categoria_1.Categorias,
                    attributes: ['nombre_categoria'],
                }]
        });
        if (productos.length === 0) {
            return res.status(404).json({
                message: 'No hay productos en esta categoria'
            });
        }
        res.json(productos);
    }
    catch (error) {
        res.status(400).json({
            message: 'Ocurrio un error al obtener los productos',
            error
        });
    }
});
exports.getProductosByCategoria = getProductosByCategoria;
const updateImagen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cod_producto } = req.params;
    const imagenFile = req.file;
    if (!imagenFile) {
        return res.status(400).json({ message: "La imagen es requerida " });
    }
    try {
        const producto = yield producto_1.Productos.findOne({ where: { cod_producto } });
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        const imagePath = path_1.default.join(__dirname, '../uploads', imagenFile.filename);
        const newImageId = yield (0, googleDrive_1.uploadPhoToToDrive)(imagePath, imagenFile.originalname, 'image/jpeg');
        fs_1.default.unlinkSync(imagePath);
        yield producto_1.Productos.update({ imagen: newImageId }, { where: { cod_producto } });
        return res.json({ message: "Imagen del producto actualizada correctamente" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Ocurrio un error al actualizar la imagen del producto',
            error
        });
    }
});
exports.updateImagen = updateImagen;
const getProductosByEmprendedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_emprendedor } = req.params;
    try {
        const productos = yield producto_1.Productos.findAll({
            where: { id_emprendedor },
            attributes: ['cod_producto', 'nombre_producto', 'precio_producto', 'descripcion_producto', 'cantidad_disponible', 'imagen'],
            include: [
                {
                    model: categoria_1.Categorias,
                    attributes: ['nombre_categoria'],
                },
                {
                    model: emprendedor_1.Emprendedor,
                    attributes: ['nombre_emprendedor'],
                }
            ]
        });
        if (!productos || productos.length === 0) {
            return res.status(204).json();
        }
        res.json(productos);
    }
    catch (error) {
        console.error("Error al consultar productos por emprendedor:", error);
        return res.status(500).json({ message: "Error al consultar productos por emprendedor", error });
    }
});
exports.getProductosByEmprendedor = getProductosByEmprendedor;
const updateProductoConDescuento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cod_producto } = req.params;
    const { precio_producto, descuento } = req.body;
    try {
        if (descuento < 0 || descuento > 100) {
            return res.status(400).json({ message: 'Descuento debe ser entre 0 y 100%' });
        }
        const producto = yield producto_1.Productos.findOne({ where: { cod_producto } });
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        const precioFinal = precio_producto ? precio_producto : producto.get('precio_producto');
        const precio_descuento = precioFinal - (precioFinal * (descuento / 100));
        yield producto_1.Productos.update({
            precio_producto: precioFinal,
            descuento: descuento,
            precio_descuento: precio_descuento
        }, {
            where: { cod_producto }
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
    }
    catch (error) {
        console.error('Error al actualizar el producto con descuento:', error);
        return res.status(500).json({
            message: 'Ocurrio un error al actualizar el producto con descuento',
            error
        });
    }
});
exports.updateProductoConDescuento = updateProductoConDescuento;
