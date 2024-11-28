import { Request, Response } from "express";
import { WebpayPlus, Options, Environment, IntegrationCommerceCodes, IntegrationApiKeys } from 'transbank-sdk';

const options = new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration);

export const createTransaction = async (req: Request, res: Response) => {
    const { amount, sessionId, buyOrder, returnUrl } = req.body;

    if (!amount || !sessionId || !buyOrder || !returnUrl) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const transaction = new WebpayPlus.Transaction(options)
        const createResponse = await transaction.create(buyOrder, sessionId, amount, returnUrl);
        console.log(createResponse.url+"?token_ws="+createResponse.token);
        res.json({
            url: createResponse.url,
            token_ws: createResponse.token
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error desconocido' });
        }
    }
};

export const commitTransaction = async (req: Request, res: Response) => {
    const token_ws = req.query.token_ws;
    if (!token_ws) {
        return res.status(400).json({ error: 'Token de transacción no proporcionado' });
    }
    try {
        const transaction = new WebpayPlus.Transaction(options)
        const commitResponse = await transaction.commit(token_ws.toString());

        if (commitResponse.vci === 'TSY' && commitResponse.status === 'AUTHORIZED') {

                res.redirect(`http://localhost:3001/#/exito`);
        } else {
                res.redirect(`http://localhost:3001/#/error`);
        }

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error desconocido' });
        }
    }
};

function getWebpayErrorMessage(commitResponse: any): string {
    if (commitResponse.vci === 'TSN') {
        return 'Transacción rechazada';
    } else if (commitResponse.status === 'REJECTED') {
        return 'Pago rechazado por el banco';
    } else {
        return 'Error desconocido';
    }
}