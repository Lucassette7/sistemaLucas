const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const db = require('../database/db')

router.get('/perfil', (req, res)=>{
    res.render('perfil.ejs')
})


//Cadastra endereço
router.put('/atualizaPerfil', (req, res)=>{
    const {email, senhaAtual, novaSenha, confirmaSenha, cnpj} = req.body
    

    const query = 'SELECT senha FROM usuario WHERE email = ?'
    db.query(query, [email], (erro, results)=>{
        if(erro){
            return res.json({success: false})
        }
        if(results.length > 0){
            
            if(email != '' && novaSenha === confirmaSenha){
                const senhaEncriptada = bcrypt.hashSync(novaSenha, 10)
                const query2 = 'UPDATE usuario SET senha = ?, email = ? WHERE cnpj = ?'
                db.query(query2, [senhaEncriptada, email, cnpj], (erro, results)=>{
                    if(erro){
                        return res.json({success: false})
                    }
                    if(results.affectedRows > 0){
                        return res.json({success: true})
                    }
                })
            }
            else{
                return res.json({success: false})
            }
        }
    })
})

module.exports = router