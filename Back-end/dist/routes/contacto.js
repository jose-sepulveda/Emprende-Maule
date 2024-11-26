"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contacto_1 = require("../controllers/contacto");
const router = (0, express_1.Router)();
router.post('/new', contacto_1.sendContactRequest);
exports.default = router;
