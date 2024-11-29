"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commitTransaction = exports.createTransaction = void 0;
const transbank_sdk_1 = require("transbank-sdk");
const options = new transbank_sdk_1.Options(transbank_sdk_1.IntegrationCommerceCodes.WEBPAY_PLUS, transbank_sdk_1.IntegrationApiKeys.WEBPAY, transbank_sdk_1.Environment.Integration);
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, sessionId, buyOrder, returnUrl } = req.body;
    if (!amount || !sessionId || !buyOrder || !returnUrl) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    try {
        const transaction = new transbank_sdk_1.WebpayPlus.Transaction(options);
        const createResponse = yield transaction.create(buyOrder, sessionId, amount, returnUrl);
        console.log(createResponse.url + "?token_ws=" + createResponse.token);
        res.json({
            url: createResponse.url,
            token_ws: createResponse.token
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Error desconocido' });
        }
    }
});
exports.createTransaction = createTransaction;
const commitTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token_ws = req.query.token_ws;
    if (!token_ws) {
        return res.status(400).json({ error: 'Token de transacción no proporcionado' });
    }
    try {
        const transaction = new transbank_sdk_1.WebpayPlus.Transaction(options);
        const commitResponse = yield transaction.commit(token_ws.toString());
        if (commitResponse.vci === 'TSY' && commitResponse.status === 'AUTHORIZED') {
            res.redirect(`http://localhost:3001/exito`);
        }
        else {
            res.redirect(`http://localhost:3001/error`);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Error desconocido' });
        }
    }
});
exports.commitTransaction = commitTransaction;
function getWebpayErrorMessage(commitResponse) {
    if (commitResponse.vci === 'TSN') {
        return 'Transacción rechazada';
    }
    else if (commitResponse.status === 'REJECTED') {
        return 'Pago rechazado por el banco';
    }
    else {
        return 'Error desconocido';
    }
}
