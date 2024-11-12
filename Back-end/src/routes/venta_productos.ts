import { Router } from "express";
import { deleteVentaProducto, updateVentaProducto } from "../controllers/venta_productos";

const router = Router();

router.delete('/:id_venta_productos', deleteVentaProducto);
router.put('/:id_venta_productos', updateVentaProducto);

export default router;

