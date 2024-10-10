import { Router } from 'express';
import { carroLocal, deleteCarroProductos, getCarrosProductos, getOneCarroProductos, updateCarroProductos } from '../controllers/carro_productos';

const router = Router();

router.get('/list/:id_cliente', getCarrosProductos);
router.get('/id_carro_productos', getOneCarroProductos);
router.put('/:id_carro_productos', updateCarroProductos);
router.delete('/:id_carro_productos', deleteCarroProductos);
router.post('/llenar', carroLocal);

export default router;