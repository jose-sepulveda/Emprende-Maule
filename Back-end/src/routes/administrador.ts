import { Router } from "express";
import { newAdmin, deleteAdmin, updateAdmin, loginAdmin } from "../controllers/administrador";

const router = Router();

router.post('/', newAdmin);
router.delete('/:id_administrador', deleteAdmin);
router.put('/:id_administrador', updateAdmin);
router.post('/login', loginAdmin);

export default router;