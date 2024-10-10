
import cors from 'cors';
import express, { Application } from 'express';
import path from 'path';
import routerCarro from '../routes/carro';
import routerCarroProductos from '../routes/carro_productos';
import routerCategoria from '../routes/categoria';
import routerCliente from '../routes/cliente';
import routerEmprendedor from '../routes/emprendedor';
import routerProducto from '../routes/producto';
import { Carro } from './carro';
import { Carro_productos } from './carro_productos';
import { Categorias } from './categoria';
import { Cliente } from './cliente';
import { Emprendedor } from './emprendedor';
import { Productos } from './producto';

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
        this.app.use('/api/carro', routerCarro);
        this.app.use('/api/carro_productos', routerCarroProductos);
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
            await Cliente.sync();
            await Carro.sync();
            await Carro_productos.sync();
        } catch (error) {
            console.error('No se ha podido conectar a la base de datos');
        }
    } 
}

export default Server;