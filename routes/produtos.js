// const express = require('express')
// const router = express.Router()
// const db = require('../database/db')
// const path = require('path')

// router.get('/produtos', (req, res)=>{
//     res.render('produtos.ejs')
// })

// //busca categoria
// router.get('/categoria', (req, res)=>{
    
//     const query = 'SELECT * FROM categoria_produto'

//     db.query(query, (erro, results)=>{
//         if(erro){
//             return res.json({success: false})
//         }
//         if(results.length > 0){
//             return res.json(results)
//         }
//     })
// })


// //pega id categoria produto
// router.get('/pegaidcategoria/:categoria', (req, res)=>{
//     const categoria = req.params.categoria
    
//     const query = 'SELECT id_categoria_produto FROM categoria_produto WHERE categoria = ?'

//     db.query(query, [categoria], (erro, results)=>{
//         if(erro){
//             return res.json({success: false})
//         }
//         if(results.length > 0){
//             return res.json(results)
//         }
//     })
// })


// //cadastra produto
// router.post('/cadastraProduto', (req, res)=>{
//     const {id_categoria2, nome_produto, descricao_produto, preco_produto, imgFormatada, quantidade} = req.body
    
//     const query = 'INSERT INTO produto (id_categoria_produto, produto, descricao, valor, img, quantidade) VALUES (?, ?, ?, ?, ?, ?)'

//     db.query(query, [id_categoria2 ,nome_produto, descricao_produto,preco_produto, imgFormatada, quantidade], (erro, results)=>{
//         if(erro){
//             return res.json({success: false})
//         }
//         if(results.affectedRows > 0){
//             return res.json({success: true})
//         }
//     })
    
// })


// module.exports = router

























const express = require('express')
const router = express.Router()
const db = require('../database/db')
const path = require('path')
const multer = require('multer')
const fs = require('fs')

router.get('/produtos', (req, res)=>{
    res.render('produtos.ejs')
})

//busca categoria
router.get('/categoria', (req, res)=>{
    
    const query = 'SELECT * FROM categoria_produto'

    db.query(query, (erro, results)=>{
        if(erro){
            return res.json({success: false})
        }
        if(results.length > 0){
            return res.json(results)
        }
    })
})


//pega id categoria produto
router.get('/pegaidcategoria/:categoria', (req, res)=>{
    const categoria = req.params.categoria
    
    const query = 'SELECT id_categoria_produto FROM categoria_produto WHERE categoria = ?'

    db.query(query, [categoria], (erro, results)=>{
        if(erro){
            return res.json({success: false})
        }
        if(results.length > 0){
            return res.json(results)
        }
    })
})


//salva a imagem do produto na pasta
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join('C:', 'Users', 'LucasSetteQueiroz', 'Desktop', 'sistemaLucas', 'public', 'imagensProdutos');

        // Cria a pasta de upload se não existir
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);   // cb(null, caminho) informa ao Multer para armazenar o arquivo neste caminho
        // No parâmetro destination, o cb é chamado para especificar o diretório onde o arquivo será armazenado. Essa função recebe três parâmetros: req, file e cb (callback). O cb é utilizado para sinalizar para o Multer onde o arquivo deve ser armazenado.
    },
    filename: (req, file, cb) => {
        const nomeArquivo = `${cnpj2}-${nomeImg}`;  // Gera um nome único para o arquivo
        cb(null, nomeArquivo);  // Define o nome do arquivo
    }
});

// Criação do upload com a configuração do Multer
const upload = multer({ storage: storage });

// Rota para lidar com o upload da imagem
router.post('/teste', upload.single('imagem-produto'), (req, res) => {
    if (req.file) {
        console.log('Imagem enviada com sucesso:', req.file);
        res.json({ success: true, message: 'Imagem recebida e salva com sucesso!' });
    } else {
        res.status(400).json({ success: false, message: 'Erro ao enviar a imagem' });
    }
});


//cadastra produto
let cnpj2 = ''
let nomeImg = ''
router.post('/cadastraProduto', (req, res)=>{
    const {id_categoria2, nome_produto, codigo, descricao_produto, preco_produto, imgFormatada, quantidade, cnpj} = req.body
    nomeImg = imgFormatada
    cnpj2 = cnpj
    
    const query = 'INSERT INTO produto (id_categoria_produto, produto, codigo, descricao, valor, img, quantidade, cnpj) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'

    db.query(query, [id_categoria2 ,nome_produto, codigo, descricao_produto,preco_produto, imgFormatada, quantidade, cnpj], (erro, results)=>{
        if(erro){
            return res.json({success: false})
        }
        if(results.affectedRows > 0){
            return res.json({success: true})
        }
    })
    
})


module.exports = router

