import { Router } from "express";
import multer from 'multer';
import path from 'path';
import { crearEmprendedor, deleteEmprendedor, getEmprendedor, getEmprendedores, updateEmprendedor, updateEstadoEmprendedor, updatePassword } from "../controllers/emprendedor";

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

router.post('/new', upload.fields([
    { name: 'comprobante', maxCount: 1},
    { name: 'imagen_local', maxCount: 1},
    { name: 'imagen_productos', maxCount: 1},
]), crearEmprendedor);
router.get('/list', getEmprendedores);
router.get('/:rut_emprendedor', getEmprendedor);
router.put('/:rut_emprendedor', updateEmprendedor);
router.delete('/:rut_emprendedor', deleteEmprendedor);
router.patch('/password', updatePassword);
router.patch('/estado', updateEstadoEmprendedor);

export default router;
