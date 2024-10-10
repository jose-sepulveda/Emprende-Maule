import { Router } from "express";
import { deletCarro, getCarro, getCarros, newCarro, updateCarro } from "../controllers/carro";

const router = Router();

router.get('/list', getCarros);
router.post('/', newCarro);
router.get('/:id_carro', getCarro);
router.put('/:id_carro', updateCarro);
router.delete('/:id_carro', deletCarro);

export default router;