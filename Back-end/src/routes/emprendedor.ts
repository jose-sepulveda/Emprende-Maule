import { Router } from "express";
import multer from 'multer';
import path from 'path';
import { crearEmprendedor, deleteEmprendedor, getEmprendedor, getEmprendedorById, getEmprendedores, getEmprendedoresPorEstado, loginEmprendedor, recuperarContrasenaEmprendedor, resetPasswordEmprendedor, updateEmprendedor, updateEstadoEmprendedor, updatePassword } from "../controllers/emprendedor";
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
    { name: 'comprobante', maxCount: 5},
    { name: 'imagen_local', maxCount: 10},
    { name: 'imagen_productos', maxCount: 10},
]), crearEmprendedor);
router.post('/login', loginEmprendedor);
router.get('/list', auth, getEmprendedores);
router.get('/:rut_emprendedor', auth, getEmprendedor);
router.put('/:rut_emprendedor',auth, updateEmprendedor);
router.delete('/:rut_emprendedor', auth, deleteEmprendedor);
router.patch('/password', auth, updatePassword);
router.patch('/estado', auth, updateEstadoEmprendedor);
router.post('/recuperar', recuperarContrasenaEmprendedor);
router.post('/reset-password-emprendedor/:token', resetPasswordEmprendedor);
router.get('/estado', getEmprendedoresPorEstado);
router.get('/id/:id_emprendedor', getEmprendedorById);

export default router;
