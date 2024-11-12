import {Router} from 'express';
import { getVentas, getVenta, getVentaCliente, createVenta } from '../controllers/ventas';

const router = Router();

router.get('/list', getVentas);
router.get('/:id_venta', getVenta);
router.get('/cliente/:id_cliente', getVentaCliente);
router.post('/:id_cliente', createVenta);

export default router;
