const seq = require('sequelize');
const connection = new seq('plataform','root','@1!#S2',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;
