import { Router } from "express";
import { deleteVentaProducto, updateVentaProducto, getVentaProducto, getVentaProductos, getVentaProductosVenta } from "../controllers/venta_productos";

const router = Router();

router.delete('/:id_venta_productos', deleteVentaProducto);
router.put('/:id_venta_productos', updateVentaProducto);
router.get('/list', getVentaProductos);
router.get('/venta/:id_venta', getVentaProductosVenta);
router.get('/:id_venta_productos', getVentaProducto);

export default router;

