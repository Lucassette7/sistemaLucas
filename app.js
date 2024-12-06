const express = require('express');
const app = express();
const session = require('express-session');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const router = express.Router();

// Configuração EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Define o diretório de views
app.use(express.static('public')); // Serve arquivos estáticos da pasta 'public'

app.use('/public', express.static(path.join(__dirname, 'public')));


// Middleware para parser de corpo (usei apenas uma vez)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// <--------------------Rotas-------------------->
//Login
const login = require('./routes/login');
app.use('/', login);

//Endereco
const endereco = require('./routes/endereco');
app.use('/', endereco);

//Cadastro Veiculo
const cadastroVeiculo = require('./routes/cadastroVeiculo');
app.use('/', cadastroVeiculo);

//Dashboard
const dashboard = require('./routes/dashboard');
app.use('/', dashboard);

//Perfil
const perfil = require('./routes/perfil');
app.use('/', perfil);

//produtos
const produtos = require('./routes/produtos')
app.use('/', produtos)

//mapa
const mapa = require('./routes/mapa')
app.use(mapa)

//estoque
const estoque = require('./routes/estoque')
app.use(estoque)

//funcionarios
const funcionarios = require('./routes/funcionarios')
app.use('/', funcionarios)
//<----------------------------------------------->

// Database
const database = require('./database/db', () => {
    if (database) {
        console.log('Conexão com o banco de dados realizada com sucesso');
    }
});

// Inicializando o servidor

app.listen(process.env.PORT ? Number(process.env.PORT) : 3333, (erro) => {
    if (erro) {
        console.log('Erro ao conectar', erro);
    } else {
        console.log('Conectado com sucesso na porta ' + (process.env.PORT || 3333));
    }
})


























