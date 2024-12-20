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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const administrador_1 = __importDefault(require("../routes/administrador"));
const carro_1 = __importDefault(require("../routes/carro"));
const carro_productos_1 = __importDefault(require("../routes/carro_productos"));
const categoria_1 = __importDefault(require("../routes/categoria"));
const cliente_1 = __importDefault(require("../routes/cliente"));
const contacto_1 = __importDefault(require("../routes/contacto"));
const emprendedor_1 = __importDefault(require("../routes/emprendedor"));
const producto_1 = __importDefault(require("../routes/producto"));
const resena_1 = __importDefault(require("../routes/resena"));
const venta_productos_1 = __importDefault(require("../routes/venta_productos"));
const ventas_1 = __importDefault(require("../routes/ventas"));
const webpayRoutes_1 = __importDefault(require("../routes/webpayRoutes"));
const pedidos_1 = __importDefault(require("../routes/pedidos"));
const administrador_2 = require("./administrador");
const carro_2 = require("./carro");
const carro_productos_2 = require("./carro_productos");
const categoria_2 = require("./categoria");
const cliente_2 = require("./cliente");
const contacto_2 = require("./contacto");
const emprendedor_2 = require("./emprendedor");
const producto_2 = require("./producto");
const resena_2 = require("./resena");
const venta_productos_2 = require("./venta_productos");
const ventas_2 = require("./ventas");
const pedidos_2 = require("./pedidos");
class Server {
    constructor() {
        var _a;
        this.app = (0, express_1.default)();
        this.port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : '3000';
        this.midlewares();
        this.listen();
        this.dbConnect();
        this.routes();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Corriendo en el puerto ' + this.port);
        });
    }
    routes() {
        this.app.use('/api/emprendedor', emprendedor_1.default);
        this.app.use('/api/categoria', categoria_1.default);
        this.app.use('/api/producto', producto_1.default);
        this.app.use('/api/cliente', cliente_1.default);
        this.app.use('/api/carro', carro_1.default);
        this.app.use('/api/carro_productos', carro_productos_1.default);
        this.app.use('/api/resena', resena_1.default);
        this.app.use('/api/administrador', administrador_1.default);
        this.app.use('/api/ventas', ventas_1.default);
        this.app.use('/api/venta_productos', venta_productos_1.default);
        this.app.use('/api/contacto', contacto_1.default);
        this.app.use('/api/webpay', webpayRoutes_1.default);
        this.app.use('/api/pedidos', pedidos_1.default);
    }
    midlewares() {
        this.app.use('/public', express_1.default.static(path_1.default.join(__dirname, '..', '..', 'public')));
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)({
            origin: 'http://localhost:3001',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
        }));
    }
    dbConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Conectado a la base de datos');
                yield emprendedor_2.Emprendedor.sync({ alter: true });
                yield categoria_2.Categorias.sync({ alter: true });
                yield producto_2.Productos.sync({ alter: true });
                yield cliente_2.Cliente.sync({ alter: true });
                yield carro_2.Carro.sync({ alter: true });
                yield carro_productos_2.Carro_productos.sync({ alter: true });
                yield resena_2.Resena.sync({ alter: true });
                yield administrador_2.Administrador.sync({ alter: true });
                yield ventas_2.Ventas.sync({ alter: true });
                yield pedidos_2.Pedidos.sync({ alter: true });
                yield venta_productos_2.Venta_productos.sync({ alter: true });
                yield contacto_2.Contacto.sync({ alter: true });
            }
            catch (error) {
                console.error('No se ha podido conectar a la base de datos');
            }
        });
    }
}
exports.default = Server;
