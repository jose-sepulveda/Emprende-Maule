import { Router } from "express";
import multer from "multer";
import { deleteProducto, getProducto, getProductos, newProducto, updateProducto, updateImagen, getProductosByCategoria, getProductosByEmprendedor } from "../controllers/producto";
import path from 'path';

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({storage});

router.post('/', upload.single('imagen'), newProducto);
router.get('/list',getProductos);
router.get('/:cod_producto',getProducto);
router.delete('/:cod_producto',deleteProducto);
router.put('/:cod_producto',updateProducto);
router.patch('/:cod_producto/updateImagen', upload.single('imagen'), updateImagen);
router.get('/categoria/:id_categoria', getProductosByCategoria);
router.get('/emprendedor/:id_emprendedor', getProductosByEmprendedor);

export default router;
