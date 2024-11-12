
import cors from 'cors';
import express, { Application } from 'express';
import path from 'path';
import routerAdministrador from '../routes/administrador';
import routerCarro from '../routes/carro';
import routerCarroProductos from '../routes/carro_productos';
import routerCategoria from '../routes/categoria';
import routerCliente from '../routes/cliente';
import routerEmprendedor from '../routes/emprendedor';
import routerProducto from '../routes/producto';
import routerResena from '../routes/resena';
import { Administrador } from './administrador';
import routerVentas from '../routes/ventas';
import { Carro } from './carro';
import { Carro_productos } from './carro_productos';
import { Categorias } from './categoria';
import { Cliente } from './cliente';
import { Emprendedor } from './emprendedor';
import { Productos } from './producto';
import { Resena } from './resena';
import { Ventas } from './ventas';

class Server {
    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT ?? '3000';

        this.midlewares();
        this.listen()
        this.dbConnect()
        this.routes()
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Corriendo en el puerto ' + this.port);
        })
    }

    routes() {
        this.app.use('/api/emprendedor', routerEmprendedor);
        this.app.use('/api/categoria', routerCategoria);
        this.app.use('/api/producto', routerProducto);
        this.app.use('/api/cliente', routerCliente);
        this.app.use('/api/carro', routerCarro)
        this.app.use('/api/carro_productos', routerCarroProductos);
        this.app.use('/api/resena', routerResena);
        this.app.use('/api/administrador', routerAdministrador);
        this.app.use('/api/ventas', routerVentas);
    }

    midlewares() {
        this.app.use('/public', express.static(path.join(__dirname, '..', '..', 'public')));
        this.app.use(express.json());
        this.app.use(cors({
            origin: 'http://localhost:3001',
            methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true, 
        }));
    }

    async dbConnect() {
        try {
            console.log('Conectado a la base de datos')
            await Emprendedor.sync({ alter: true });
            await Categorias.sync({ alter: true });
            await Productos.sync({ alter: true });
            await Cliente.sync({ alter: true });
            await Carro.sync({ alter: true });
            await Carro_productos.sync({ alter: true });
            await Resena.sync({ alter: true });
            await Administrador.sync({ alter: true});
            await Ventas.sync({ alter: true });
        } catch (error) {
            console.error('No se ha podido conectar a la base de datos');
        }
    } 
}

export default Server;