const express = require('express');
const router = express.Router();
const Category = require('../categories/Category.js');
const Articles = require('./Article.js');
const slugfy = require('slugify');
const { default: slugify } = require('slugify');

// BUSCANDO O MIDDLEWARE
const adminMiddle = require('../middlewares/adminAuth.js');

router.get('/admin/articles', adminMiddle , (req,res) => { // ROTA PARA TER ACESSO E CONTROLAR ARTIGOS
    Articles.findAll({
      include: [{model: Category} ] // BUSCANDO DADOS DE OUTRA TABELA COM RELACIONAMENTO SRC ('INDEX.EJS LINHA 25')  
    }).then(articles => {
    res.render('articles/index.ejs', {articles: articles});
    })
})

router.get('/admin/articles/new', adminMiddle, (req,res) => {
    Category.findAll().then((categories) =>{
        res.render('articles/new.ejs', {categories: categories})
    })
})

router.post('/articles/save', adminMiddle , (req,res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category

    Articles.create({
        title: title,
        slug: slugfy(title),
        body: body,
        categoryId: category // CHAVE ESTRANGEIRA 
    }).then(() => {
        res.redirect('/admin/articles')
    })
})

router.post('/articles/delete/:id', adminMiddle ,(req , res)=>{
    var id = req.params.id
   if(id != undefined){
    Articles.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/articles')
    })
}
});

router.post('/admin/articles/edit/:id', adminMiddle , (req,res) => {
    var id = req.params.id
    Articles.findOne({
        where: { id: id},
        include: [{model: Category}]
    }).then((article) =>{
        Category.findAll().then((categories) =>{
        res.render('articles/edit.ejs', {article: article, categories: categories})
        })
    })
})

router.post('/admin/articles/edit/:id/save', adminMiddle , (req,res) => {
    var id = req.params.id
    var body = req.body.body
    var title =  req.body.title
    var category = req.body.category

    Articles.findByPk(id).then(() =>{
        Articles.update({
            title: title,
            body: body,
            categoryId: category, // CHAVE ESTRANGEIRA 
            slug: slugfy(title)
        },{
            where: {
                id: id
            }

        }).then(() => {
            res.redirect('/admin/articles')
        })
    })
})

module.exports = router;