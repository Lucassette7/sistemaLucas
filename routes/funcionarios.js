const express = require('express')
const router = express.Router()

router.get('/funcionarios', (req, res)=>{
    res.render('funcionarios.ejs')
})

module.exports = router