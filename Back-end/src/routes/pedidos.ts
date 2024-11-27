import { Router } from "express";
import { getPedido, getPedidos, getPedidoByCliente, getPedidoByEmprendedor, updateEstadoPedido } from "../controllers/pedido";

const router = Router();

router.get('/list', getPedidos);
router.get('/:id_pedido', getPedido);
router.get('/cliente/:id_cliente', getPedidoByCliente);
router.get('/emprendedor/:id_emprendedor', getPedidoByEmprendedor);
router.put('/:id_pedido', updateEstadoPedido);

export default router;