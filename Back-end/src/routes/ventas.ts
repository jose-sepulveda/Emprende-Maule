import {Router} from 'express';
import { getVentas, getVenta } from '../controllers/ventas';

const router = Router();

router.get('/list', getVentas);
router.get('/:id_venta', getVenta);

export default router;
