import { Router } from "express";
import { newCliente, deleteCliente, updateCliente, loginCliente, resetContrasena } from "../controllers/cliente";

const router = Router();

router.post('/', newCliente);
router.post('/login', loginCliente);
router.delete('/:id_cliente', deleteCliente);
router.put('/:id_cliente', updateCliente);
router.post('/reset', resetContrasena);

export default router;

