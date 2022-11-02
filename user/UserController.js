const express = require('express');
const router = express.Router();
const User = require('./User')
const Category = require('../categories/Category.js');
const bcrypt = require('bcryptjs');
 
// BUSCANDO O MIDDLEWARE
const adminMiddle = require('../middlewares/adminAuth.js');

router.get('/admin/users',adminMiddle, (req, res)=>{
    User.findAll().then((users)=> {
        res.render('user/index.ejs', {usuarios: users})
    })
})

router.get('/admin/users/create',adminMiddle, (req, res)=>{
    Category.findAll().then((categories) =>{
    res.render('user/new.ejs', {categories: categories});
    })
})

router.post('/users/create',adminMiddle, (req, res)=>{
    var email = req.body.email
    var password = req.body.password
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt)

    //VERIFICAÇÃO DE EMAIL
    User.findOne({where:{email:email}}).then((user) => {
        if (user == undefined){
    // testando uma responde em json - res.json({email, password})
        User.create({
            email: email,
            password: hash
        }).then(() => {
            res.redirect('/admin/users')
        }).catch(() => {
            res.redirect('/admin/users')
        })}
    else {
        res.redirect('/admin/users/create')
    }    
    })   })

// AUTHENTICATION
router.get('/login', (req, res) => {
    res.render('user/login.ejs')
})

router.post('/auth', (req,res) => {
    var email = req.body.email
    var pass = req.body.password
 
    User.findOne({where : {email: email}}).then(user =>{
         if(user != undefined){
             //VALIDANDO SENHA
             var result = bcrypt.compareSync(pass, user.password);
             if(result){
                 req.session.user = {
                     id: user.id,
                     email: user.email
                 }
                 //res.json(req.session.user);
                 res.redirect('/admin/articles')
             }else{
                 res.redirect('/login');
             }
         }else{
             res.redirect('/');
         }
    })
 })

 //LOGOUT
 router.get('/logout',adminMiddle, (req,res) => {
    req.session.user = undefined
    res.redirect('/');
 })
module.exports = router;