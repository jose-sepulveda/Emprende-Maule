"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const administrador_1 = require("../controllers/administrador");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = (0, express_1.Router)();
router.post('/', administrador_1.newAdmin);
router.delete('/:id_administrador', auth_1.default, administrador_1.deleteAdmin);
router.put('/:id_administrador', auth_1.default, administrador_1.updateAdmin);
router.post('/login', administrador_1.loginAdmin);
router.get('/list', auth_1.default, administrador_1.getAdministradores);
router.get('/:id_administrador', auth_1.default, administrador_1.getAdminById);
router.post('/recuperar', administrador_1.recuperarContrasena);
router.post('/reset-password/:token', administrador_1.resetPasswordAdmin);
exports.default = router;
