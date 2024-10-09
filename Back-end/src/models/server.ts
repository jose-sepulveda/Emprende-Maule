
import cors from 'cors';
import express, { Application } from 'express';
import path from 'path';
import routerEmprendedor from '../routes/emprendedor';
import routerCategoria from '../routes/categoria';
import routerProducto from '../routes/producto';
import routerCliente from '../routes/cliente';
import routerAdministrador from '../routes/administrador';
import { Emprendedor } from './emprendedor';
import { Categorias } from './categoria';
import { Productos } from './producto';
import { Cliente } from './cliente';
import { Administrador } from './administrador';

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
        this.app.use('/api/administrador', routerAdministrador);
    }

    midlewares() {
        this.app.use('/public', express.static(path.join(__dirname, '..', '..', 'public')));
        this.app.use(express.json());
        this.app.use(cors());
    }

    async dbConnect() {
        try {
            console.log('Conectado a la base de datos')
            await Emprendedor.sync()
            await Categorias.sync()
            await Productos.sync()
            await Cliente.sync()
            await Administrador.sync();
        } catch (error) {
            console.error('No se ha podido conectar a la base de datos');
        }
    } 
}

export default Server;