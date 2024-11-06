import { Router } from "express";
import { newAdmin, deleteAdmin, updateAdmin, loginAdmin, getAdminById, getAdministradores } from "../controllers/administrador";
import auth from "../middlewares/auth";

const router = Router();

router.post('/', newAdmin);
router.delete('/:id_administrador', auth, deleteAdmin);
router.put('/:id_administrador', auth, updateAdmin);
router.post('/login', loginAdmin);
router.get('/list', auth, getAdministradores);
router.get('/:id_administrador', auth, getAdminById);

export default router;