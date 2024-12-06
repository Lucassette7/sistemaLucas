const express = require('express')
const router = express.Router()
const axios = require('axios')

router.get('/cadastroVeiculo', (req, res)=>{
    res.render('cadastroVeiculo.ejs')
})


router.get('/modelos/:marca', async (req, res)=>{
    const marca = req.params.marca
    
    const response = await axios.get(`https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getModels&make=${marca}`)
    if(response){
        console.log(response.data)
    }
})




module.exports = router
