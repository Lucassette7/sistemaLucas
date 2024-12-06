const db = require('mysql2')

const conexao = db.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'sistemalucas',
    password: ''
})

conexao.connect((erro) =>{
    if(erro){
        console.log('erro ao conectar ao banco ')
    }
    else{
        console.log('Conectado com sucesso')
    }
})

module.exports = conexao;