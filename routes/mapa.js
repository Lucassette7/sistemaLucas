const express = require('express')
const router = express.Router()

router.get('/mapa', (req, res)=>{
    res.render('mapa.ejs')
})

module.exports = router