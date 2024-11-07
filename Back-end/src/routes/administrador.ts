import { Router } from "express";
import { newAdmin, deleteAdmin, updateAdmin, loginAdmin, getAdminById, getAdministradores, recuperarContrasena, resetPasswordAdmin } from "../controllers/administrador";
import auth from "../middlewares/auth";

const router = Router();

router.post('/', newAdmin);
router.delete('/:id_administrador', auth, deleteAdmin);
router.put('/:id_administrador', auth, updateAdmin);
router.post('/login', loginAdmin);
router.get('/list', auth, getAdministradores);
router.get('/:id_administrador', auth, getAdminById);
router.post('/recuperar', recuperarContrasena),
router.post('/reset-password/:token', resetPasswordAdmin);

export default router;