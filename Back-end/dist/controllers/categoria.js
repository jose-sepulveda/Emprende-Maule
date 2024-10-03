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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoria = exports.getOneCategoria = exports.updateCategoria = exports.newCategoria = exports.getCategoria = void 0;
const categoria_1 = require("../models/categoria");
const getCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listCategoria = yield categoria_1.Categorias.findAll({ attributes: ['id_categoria', 'nombre_categoria', 'estado_categoria'] });
        res.json(listCategoria);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las categorias.' });
    }
});
exports.getCategoria = getCategoria;
const newCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre_categoria, estado_categoria } = req.body;
    try {
        yield categoria_1.Categorias.create({
            "nombre_categoria": nombre_categoria,
            "estado_categoria": estado_categoria
        });
        return res.status(201).json({
            message: 'Categoria creada con exito'
        });
    }
    catch (error) {
        res.status(400).json({
            message: 'Ocurrio un error al crear la categoria',
            error
        });
    }
});
exports.newCategoria = newCategoria;
const updateCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_categoria } = req.params;
    const { nombre_categoria, estado_categoria } = req.body;
    const idCategoria = yield categoria_1.Categorias.findOne({ where: { id_categoria: id_categoria } });
    if (!idCategoria) {
        return res.status(404).json({
            message: 'Categoria no encontrada'
        });
    }
    try {
        yield categoria_1.Categorias.update({
            nombre_categoria: nombre_categoria,
            estado_categoria: estado_categoria
        }, { where: { id_categoria: id_categoria } });
        return res.json({
            message: 'Categoria' + id_categoria + 'actualiazada correctamente'
        });
    }
    catch (error) {
        return res.status(4004).json({
            message: 'Ocurrio un error al actualizar la categoria: ' + id_categoria,
            error
        });
    }
});
exports.updateCategoria = updateCategoria;
const getOneCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_categoria } = req.params;
    const idCategoria = yield categoria_1.Categorias.findOne({ where: { id_categoria: id_categoria } });
    if (!idCategoria) {
        return res.status(404).json({
            message: "La categoria: " + id_categoria + " no existe"
        });
    }
    try {
        const categoriaOne = yield categoria_1.Categorias.findOne({ where: { id_categoria: id_categoria } });
        res.json(categoriaOne);
    }
    catch (error) {
        return res.status(400).json({
            message: 'Ha ocurrido un error al encontrar la categoria: ' + id_categoria,
            error
        });
    }
});
exports.getOneCategoria = getOneCategoria;
const deleteCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_categoria } = req.params;
    const idCategoria = yield categoria_1.Categorias.findOne({ where: { id_categoria: id_categoria } });
    if (!idCategoria) {
        return res.status(404).json({
            message: "La categoria: " + id_categoria + " no existe"
        });
    }
    try {
        yield categoria_1.Categorias.destroy({ where: { id_categoria: id_categoria } });
        return res.json({
            message: 'La categoria: ' + id_categoria + ' ha sido eliminada correctamente'
        });
    }
    catch (error) {
        return res.status(400).json({
            message: 'Ha ocurrido un error al eliminar la categoria: ' + id_categoria,
            error
        });
    }
});
exports.deleteCategoria = deleteCategoria;
