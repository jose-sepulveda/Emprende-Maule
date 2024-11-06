import { Router } from "express";
import { newCliente, deleteCliente, updateCliente, loginCliente, recuperarContrasena, getClienteById, getClientes, resetPasswordToken } from "../controllers/cliente";

const router = Router();

router.post('/', newCliente);
router.post('/login', loginCliente);
router.delete('/:id_cliente', deleteCliente);
router.put('/:id_cliente', updateCliente);
router.post('/recuperar', recuperarContrasena);
router.post('/reset-password/:token', resetPasswordToken)
router.get('/list', getClientes);
router.get('/:id_cliente', getClienteById);

export default router;

