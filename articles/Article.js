const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/Category.js');
const Article = connection.define('article',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }

})


Category.hasMany(Article); // Tem MUITOS
Article.belongsTo(Category); // UM PARA UM

//Article.sync({force: true});

module.exports = Article;