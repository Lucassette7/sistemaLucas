const express = require('express')
const router = express.Router()
const db = require('../database/db')

router.get('/dashboard', (req, res)=>{
    res.render('dashboard.ejs')
})

// envia dados dos meses para o grafico
router.get('/enviaDadosGrafico', (req, res)=>{
    const query = 'SELECT * FROM view_vendas_mes'

    db.query(query, (erro, results)=>{
        if(erro){
            return res.json({success: false})
        }
        if(results.length > 0){
            return res.json(results)

        }
    })
})



// envia dados grafico barro
router.get('/enviaDadosGraficoProdutos/:filtro', (req, res)=>{
const filtro = req.params.filtro
    const query = 'SELECT * FROM produto WHERE produto = ?'

    db.query(query, [filtro], (erro, results)=>{
        if(erro){
            return res.json({success: false})
        }
        if(results.length > 0){
            return res.json(results)
        }
    })
})






module.exports = router