import { Router } from "express";
import multer from 'multer';
import path from 'path';
import { crearEmprendedor, deleteEmprendedor, getEmprendedor, getEmprendedores, loginEmprendedor, updateEmprendedor, updateEstadoEmprendedor, updatePassword } from "../controllers/emprendedor";
import auth from '../middlewares/auth';

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
router.post('/login', loginEmprendedor);
router.get('/list', auth, getEmprendedores);
router.get('/:rut_emprendedor', auth, getEmprendedor);
router.put('/:rut_emprendedor',auth, updateEmprendedor);
router.delete('/:rut_emprendedor', auth, deleteEmprendedor);
router.patch('/password', auth, updatePassword);
router.patch('/estado', auth, updateEstadoEmprendedor);

export default router;
