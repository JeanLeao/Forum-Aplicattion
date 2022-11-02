const express = require('express');
const router = express.Router();
const Category = require('./Category.js');
const slugfy = require('slugify');
// BUSCANDO O MIDDLEWARE
const adminMiddle = require('../middlewares/adminAuth.js');

router.use(express.urlencoded({extended: true}))
router.use(express.json());


router.get('/admin/categories', adminMiddle, (req,res) => {
    Category.findAll().then(categories => {
        res.render('admin/viewcategory.ejs', {caty: categories})

    })
});

router.get('/admin/categories/new', adminMiddle , (req,res) => {
    res.render('admin/categoriesnew.ejs')
}); 

router.post('/categories/save', adminMiddle, (req,res) => {
    var title = req.body.title;
    if (title != undefined){
        Category.create({
            title: title,
            slug: slugfy(title)
        }).then(() =>{
            res.redirect('/');
        })
        
    }else{
        res.redirect('/')
    }
}); 

router.post('/categories/delete/:id',adminMiddle,(req , res)=>{
    var id = req.params.id
   if(id != undefined){
    Category.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/categories')
    })

/*/    if(!isNaN(id)){// NOT NUMBER
        res.redirect('/admin/categories')
    }else{//NULL
        res.redirect('/admin/categories')  
   } /*/
}
});

router.post('/admin/categories/edit/:id', adminMiddle, (req,res) => {  // EDITAR PAGE
    var id = req.params.id

    if (isNaN(id)){
    res.redirect('/admin/categories')
    }
    Category.findByPk(id).then(cat =>{
        if (cat != undefined){

            res.render('admin/editcat.ejs', {categoria: cat})

        }else{
            res.redirect('/admin/categories')
        }
    }).catch(err => {
        res.redirect('/admin/categories')
    })
})

router.post('/admin/categories/edit/:id/save', adminMiddle,(req,res) => {  // EDITAR PAGE
    var title = req.body.title
    var id = req.params.id

    Category.findByPk(id).then(() =>{
        Category.update({
            
            title: title,
            slug: slugfy(title)
        },{
            where: {
                id: id
            }
        }).then(() => {
            res.redirect('/admin/categories')
        })
    })
})

module.exports = router;