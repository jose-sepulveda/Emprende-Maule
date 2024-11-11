import { Router } from "express";
import { deleteCliente, getClienteById, getClientes, loginCliente, newCliente, recuperarContrasenaCliente, resetPasswordCliente, updateCliente } from "../controllers/cliente";

const router = Router();

router.post('/', newCliente);
router.post('/login', loginCliente);
router.delete('/:id_cliente', deleteCliente);
router.put('/:id_cliente', updateCliente);
router.post('/recuperar', recuperarContrasenaCliente);
router.post('/reset-password-cliente/:token', resetPasswordCliente);
router.get('/list', getClientes);
router.get('/:id_cliente', getClienteById);

export default router;

