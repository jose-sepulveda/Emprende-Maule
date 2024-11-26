import { Router } from "express";
import { sendContactRequest } from "../controllers/contacto";


const router = Router();

router.post('/new', sendContactRequest);

export default router;