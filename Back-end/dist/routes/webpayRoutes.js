"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const webpayController_1 = require("../controllers/webpayController");
const router = express_1.default.Router();
router.post('/create', webpayController_1.createTransaction);
router.get('/commit', webpayController_1.commitTransaction);
exports.default = router;
