const express = require('express')
const router = express.Router()
const db = require('../database/db')

router.get('/estoque', (req, res)=>{
    res.render('estoque.ejs')
})

// Rota de busca de dados para o DataTables
router.get('/buscaDados/:cnpj', (req, res) => {
    const cnpj = req.params.cnpj
    const query = 'SELECT * FROM view_estoque WHERE cnpj = ?';
    db.query(query,[cnpj], (erro, results) => {
        if (erro) {
            return res.json({ success: false, message: 'Erro ao buscar os dados.' });
        }

        // Caso haja resultados, retornamos os dados em formato JSON com a chave 'data'
        if (results.length > 0) {
            return res.json({ data: results });
        } else {
            return res.json({ data: [] }); // Caso não haja dados, retornamos um array vazio
        }
    });
});

// deletar o item do estoque
router.delete('/deletarItem/:id/:cnpj', (req, res)=>{
    const id = req.params.id
    const cnpj = req.params.cnpj

    const query = 'DELETE FROM produto WHERE ID_PRODUTO = ? and cnpj = ?'

    db.query(query, [id, cnpj], (erro, results)=>{
        if(erro){
            return res.json({success: false})
        }
        if(results.affectedRows > 0){
            return res.json({success: true})
        }
        else{
            return res.json({success: false})
        }
    })
})

//edita estoque
router.put('/editaEstoque/:cnpj', (req, res)=>{
    const {id2, quantidade, valor} = req.body
    const cnpj = req.params.cnpj

    const query = 'UPDATE produto SET quantidade = ?, valor = ? WHERE id_produto = ? and cnpj = ?'

    db.query(query, [quantidade, valor, id2, cnpj], (erro, results)=>{
        if(erro){
            return res.json({success: false})
        }
        if(results.affectedRows > 0){
            return res.json({success: true})
        }
    })
    
})


module.exports = router