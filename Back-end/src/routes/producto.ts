import { Router } from "express";
import multer from "multer";
import { deleteProducto, getProducto, getProductos, newProducto, updateProducto, getProductosByCategoria, getProductosByEmprendedor, updateImagenYDescuento } from "../controllers/producto";
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
router.get('/categoria/:id_categoria', getProductosByCategoria);
router.get('/emprendedor/:id_emprendedor', getProductosByEmprendedor);
router.put('/:cod_producto/actualizar', upload.single('imagen'), updateImagenYDescuento);

export default router;
