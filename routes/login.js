const express = require('express')
const router = express.Router()
const db = require('../database/db')
const axios = require('axios')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

//renderiza pagina de login
router.get('/',(req, res)=>{
    res.render('login.ejs')
})

//cadastra dados
router.post('/salvaDados', async (req, res)=>{
    let {nome, cnpj, email, telefone, senha, cep, estado, cidade, bairro, rua, numero} = req.body
    const saltRouts = 10
    const senhaEncriptada = bcrypt.hashSync(senha, saltRouts)

    const query = 'INSERT INTO usuario (nome, cnpj, email, telefone, senha, cep, estado, cidade, bairro, rua, numero) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'

    db.query(query, [nome ,cnpj, email, telefone, senhaEncriptada, cep, estado, cidade, bairro, rua, numero], (err, results)=>{

        if(err){
            console.log('erro:' + err)
            return res.json({success: false})
        }
        if(results.affectedRows > 0){
            return res.json({success: true})
        }

    })

})

//Preenche dados pelo cep
router.get('/cep/:cep', (req, res)=>{
    const cep = req.params.cep

    axios.get(`https://viacep.com.br/ws/${cep}/json/`)
    .then((response)=>{
        if(response.data){
            return res.json(response.data)
        }
    })
})

router.post('/validaDados', async (req, res) => {
    const { cnpj, senha } = req.body;
    
    

    // Consulta ao banco para recuperar a senha criptografada
    const query = 'SELECT senha, nome, cnpj FROM usuario WHERE cnpj = ?';

    try {
        const results = await new Promise((resolve, reject) => {
            db.query(query, [cnpj], (erro, results) => {
                if (erro) {
                    return reject('Erro ao consultar o banco');
                }
                resolve(results);
            });
        });

        if (results.length === 0) {
            // Se não encontrar o usuário no banco
            return res.json({ success: false, message: 'Cnpj nao encontrado' });
        }

        // Recuperar a senha criptografada do banco
        const senhaBanco = results[0].senha;
        

        // Comparar a senha fornecida com a criptografada no banco
        bcrypt.compare(senha, senhaBanco, (err, isMatch) => {
            if (err) {
                console.error('Erro ao comparar senha:', err);
                return res.json({ success: false, message: 'Erro no processo de autenticação' });
            }

            if (isMatch) {
                const { nome, sobrenome } = results[0];
                return res.json({
                    success: true,
                    message: 'Login bem-sucedido',
                    user: { nome, sobrenome }  // Envia o usuário com os dados necessários
                });
            } else {
                // Senha incorreta
                return res.json({ success: false, message: 'Senha incorreta' });
            }
        });

    } catch (err) {
        console.error('Erro ao consultar o banco ou comparar senha:', err);
        return res.json({ success: false, message: 'Erro interno no servidor' });
    }
});

//Envia dados para o session
router.get('/session/:email', (req, res)=>{
    const email = req.params.email
    
    const query = 'SELECT id_usuario FROM usuario WHERE email = ?'

    db.query(query, [email], (erro, results)=>{
        if(erro){
            return res.status(404).json('erro')
        }
        if(results.length > 0){
            return res.json(results)
        }
    })
})

// Rota para enviar email
let email1 = ''
router.get('/enviarEmail/:email', async (req, res) => {
    const email = req.params.email;
    email1 = email
    
    
    let nome3 = '';
    let sobrenome3 = '';

    const query = 'SELECT nome, sobrenome FROM usuario WHERE email = ?';

    // Função para recuperar nome e sobrenome do banco
    const getUserData = () => {
        return new Promise((resolve, reject) => {
            db.query(query, [email], (erro, results) => {
                if (erro) {
                    reject('Erro ao consultar banco de dados');
                }
                if (results.length > 0) {
                    const nome2 = results[0].nome;
                    const sobrenome2 = results[0].sobrenome;
                    resolve({ nome3: nome2, sobrenome3: sobrenome2 });
                } else {
                    reject('Usuário não encontrado');
                }
            });
        });
    };

    try {
        // Recuperar nome e sobrenome
        const user = await getUserData();
        nome3 = user.nome3;
        sobrenome3 = user.sobrenome3;

        const pagina = 'https://abrir.link/QsJcQ';
        
        // Validação simples de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'E-mail inválido' });
        }

        // Configuração do transportador com credenciais do Zoho
        const transporter = nodemailer.createTransport({
            host: 'smtp.zoho.com',  // Host correto para Zoho Mail
            port: 587,  // Porta correta para SMTP com TLS
            secure: false,  // Usando STARTTLS, portanto 'false' para não usar SSL direto
            auth: {
                user: 'lucas7mario@zohomail.com',  // Seu e-mail de envio
                pass: 'Mudando12#'  // Senha do seu e-mail ou senha de aplicativo (se necessário)
            },
            tls: {
                rejectUnauthorized: false // Permitir comunicação segura
            }
        });

        // Opções do e-mail
        const mailOptions = {
            from: 'lucas7mario@zohomail.com',  // Endereço do remetente
            to: email,  // Destinatário
            subject: 'Recuperação de senha',  // Assunto do e-mail
            text: `Olá ${nome3} ${sobrenome3},\n\nPara recuperar a senha, acesse o link abaixo:\n\n Link: ${pagina}`  // Corpo do e-mail
        };

        // Enviar e-mail
        transporter.sendMail(mailOptions, (erro, info) => {
            if (erro) {
                console.error('Erro ao enviar o e-mail:', erro);
                return res.status(500).json({
                    success: false,
                    message: 'Erro ao enviar e-mail',
                    error: erro.message
                });
            } else {
                console.log('E-mail enviado com sucesso:', info.response);
                return res.status(200).json({
                    success: true,
                    message: 'E-mail enviado com sucesso',
                    info: info.response
                });
            }
        });
    } catch (erro) {
        console.error('Erro ao recuperar dados do usuário ou enviar e-mail:', erro);
        return res.status(500).json({
            success: false,
            message: 'Erro ao processar a solicitação'
        });
    }
});


//renderiza pagina de recuperacao de senha
router.get('/recuperaSenha', (req, res)=>{
    res.render('recuperaSenha.ejs')
})

router.put('/senhaNova', (req, res)=>{
    const {senha, confirmaSenha} = req.body
    
    
    const numeroEncriptar = 10

    const senhaEncriptada = bcrypt.hashSync(senha, numeroEncriptar)

    const query = 'UPDATE usuario SET senha = ? WHERE email = ?'
    db.query(query, [senhaEncriptada ,email1], (erro, results)=>{
        if(erro){
            return res.send('Erro ao alterar senha')
        }
        if(results.affectedRows > 0){
            return res.json({success: true})
        }
    })
})

module.exports = router