import { Router } from "express";
import { getContactos, getOneContacto, sendContactRequest, updateEstadoSolicitud } from "../controllers/contacto";


const router = Router();

router.post('/new', sendContactRequest);
router.get('/list', getContactos);
router.get('/:id_contacto', getOneContacto);
router.put('/estado', updateEstadoSolicitud);

export default router;