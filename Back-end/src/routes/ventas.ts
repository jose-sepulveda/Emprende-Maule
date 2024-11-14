import {Router} from 'express';
import { getVentas, getVenta, getVentaCliente, createVenta, deleteVenta } from '../controllers/ventas';

const router = Router();

router.get('/list', getVentas);
router.get('/:id_venta', getVenta);
router.get('/cliente/:id_cliente', getVentaCliente);
router.post('/:id_cliente', createVenta);
router.delete('/:id_venta', deleteVenta);

export default router;
