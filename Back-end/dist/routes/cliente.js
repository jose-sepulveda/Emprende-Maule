"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cliente_1 = require("../controllers/cliente");
const router = (0, express_1.Router)();
router.post('/', cliente_1.newCliente);
router.post('/login', cliente_1.loginCliente);
router.delete('/:id_cliente', cliente_1.deleteCliente);
router.put('/:id_cliente', cliente_1.updateCliente);
router.post('/recuperar', cliente_1.recuperarContrasenaCliente);
router.post('/reset-password-cliente/:token', cliente_1.resetPasswordCliente);
router.get('/list', cliente_1.getClientes);
router.get('/:id_cliente', cliente_1.getClienteById);
exports.default = router;
