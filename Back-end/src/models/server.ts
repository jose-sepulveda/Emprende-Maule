
import cors from 'cors';
import express, { Application } from 'express';
import path from 'path';
import { Emprendedor } from './emprendedor';

class Server {
    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3000';

        this.midlewares();
        this.listen()
        this.dbConnect()
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Corriendo en el puerto ' + this.port);
        })
    }

    routes() {
        //
    }

    midlewares() {
        this.app.use('public', express.static(path.join(__dirname, '..', '..', 'public')));
        this.app.use(express.json());
        this.app.use(cors());
    }

    async dbConnect() {
        try {
            await Emprendedor.sync()
        } catch (error) {
            console.error('No se ha podido conectar a la base de datos');
        }
    } 
}

export default Server;