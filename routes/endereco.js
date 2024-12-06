const express = require('express')
const router = express.Router()
const axios = require('axios');
const { cat } = require('shelljs');

router.get('/endereco', (req, res)=>{
    res.render('endereco.ejs')
})


router.get('/cep/:cep', async (req, res)=>{
    const cep = req.params.cep

    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
    if(response){
        
        return res.json(response.data)
    }
})

module.exports = router