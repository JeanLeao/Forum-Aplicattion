const express = require('express');
const app = express();

const session = require('express-session'); // IMPORTANDO SESSION PARA UTILIZAR COM COOKIE
const connection = require('./database/database.js');
const categoriesController = require('./categories/CategoriesController.js');
const articlesController = require('./articles/ArticlesController.js');
const userController = require('./user/UserController.js') 

//CONFIGURAÇÃO
const Article = require('./articles/Article.js');
const Category = require('./categories/Category.js');
const User = require('./user/User.js');

// VIEW ENGINE 
app.set('view engine', 'ejs');
//SESSIONS 
app.use(session({
     secret: "qualquercoisa",
     cookie: {maxAge: 30000} // 30 SEGUNDOS PARA LIMITE DE ARMAZENAMENTO
}))
//STATIC ARCHIVES
app.use(express.static('public'));

//DATABASE
connection.authenticate().then(() => {
    console.log('Conneted')
}).catch((err) => {
    console.log(err)
})

app.use('/',categoriesController);
app.use('/',articlesController);
app.use('/',userController);


app.get('/', (req,res) =>{
    Article.findAll({
        order:[['id','DESC']] // ID PARA PEGAR O MAIS RECENTE
    }).then((articles) => {
        Category.findAll().then((categories) => { // PEGANDO TODAS AS CATEGORIAS PARA A NAVBAR
            res.status(200).render('pagina.ejs', {articles: articles, categories: categories});
        })
    })
    
})

app.get('/:slug',(req,res) => {
    
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then((article) => {
        if (article != undefined) {
            Category.findAll().then((categories) => { // PEGANDO TODAS AS CATEGORIAS PARA A NAVBAR

                res.render('articles.ejs', {article: article, categories: categories});
            })
        }else {
            res.redirect('/');          
        }
    })
})

app.get('/category/:slug',(req,res) => {
    var slug = req.params.slug
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}] // CONSUMINDO O ARTICLE ATRIBUIDO DA CATEGORIA 
    }).then((category) => {
        if (category != undefined){
            Category.findAll().then((categories) => { // PEGANDO TODAS AS CATEGORIAS PARA A NAVBAR
                console.log(category.articles)
                res.render('pagina.ejs',{
                    articles: category.articles, //CONSUMINDO O ARTICLES ATRÁVES DO MODEL ACIMA  E JOGANDO ELE PARA A ATRIBUIÇÃO ARTICLES PARA USAR ELE NA PAGINA A SEGUIR JUNTO COM A ROTA!
                    categories: categories
                })
            })

        }else{
            res.redirect('/')
        }
    }).catch(() => {
        res.redirect('/')
    })
})

/* CONTROLE DE SESSION - TESTANDO

app.get('/session', (req,res) =>{
    req.session.chave = "leao"
    req.session.ano = 2022
    req.session.email = "jeanc.leaosantos@gmail.com"
    req.session.user = {
        chave: "leao",
        ano: 2022,
        email: "jeanc.leaosantos@gmail.com",
        id: 10
    }
    res.send('session gerated')
})

app.get('/leitura', (req,res) =>{
    res.json({
        user : req.session.user
    })
}) */



app.listen(8080, () =>{
    
    console.log('Funcionando.')
})