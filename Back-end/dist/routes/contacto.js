"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contacto_1 = require("../controllers/contacto");
const router = (0, express_1.Router)();
router.post('/new', contacto_1.sendContactRequest);
router.get('/list', contacto_1.getContactos);
router.get('/:id_contacto', contacto_1.getOneContacto);
router.put('/estado', contacto_1.updateEstadoSolicitud);
exports.default = router;
