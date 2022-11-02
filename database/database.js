const seq = require('sequelize');
const connection = new seq('plataform','root','334499mil',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;