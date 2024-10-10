import { Router } from "express";
import { newAdmin, deleteAdmin, updateAdmin, loginAdmin, getAdminById, getAdministradores } from "../controllers/administrador";

const router = Router();

router.post('/', newAdmin);
router.delete('/:id_administrador', deleteAdmin);
router.put('/:id_administrador', updateAdmin);
router.post('/login', loginAdmin);
router.get('/list', getAdministradores);
router.get('/:id_administrador', getAdminById);

export default router;