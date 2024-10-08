"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const administrador_1 = require("../controllers/administrador");
const router = (0, express_1.Router)();
router.post('/', administrador_1.newAdmin);
router.delete('/:id_administrador', administrador_1.deleteAdmin);
router.put('/:id_administrador', administrador_1.updateAdmin);
router.post('/login', administrador_1.loginAdmin);
router.get('/list', administrador_1.getAdministradores);
router.get('/:id_administrador', administrador_1.getAdminById);
exports.default = router;
