import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('Emprende-Maule', 'admin', 'admin', {
    host: 'localhost',
    dialect: 'postgres',
});

export default sequelize;