import { Router } from "express";
import { crearResena, actualizarResena, eliminarResena, consultarResenaCliente, consultarResenaProducto } from "../controllers/resena";

const router = Router();

router.post('/', crearResena);
router.put('/:id_resena', actualizarResena);
router.delete('/:id_resena', eliminarResena);
router.get('/cliente/:id_cliente', consultarResenaCliente);
router.get('/producto/:cod_producto', consultarResenaProducto);

export default router;
