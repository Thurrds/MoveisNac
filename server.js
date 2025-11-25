const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Configurações Iniciais
app.use(cors()); 
app.use(express.json()); 

// --- SIMULAÇÃO DE BANCO DE DADOS ---
const produtos = [
    { id: 1, nome: "Sofá Retrátil Elegance", categoria: "sofás", preco: 2899.90, descricao: "Sofá 3 lugares em linho cinza, ultra confortável.", imagem: "https://via.placeholder.com/350x250/0a2e36/f0a500?text=Sofa+Elegance" },
    { id: 2, nome: "Mesa de Jantar Sierra", categoria: "mesas", preco: 1999.00, descricao: "Mesa para 6 lugares com tampo de vidro e base em madeira.", imagem: "https://via.placeholder.com/350x250/343a40/f0a500?text=Mesa+Sierra" },
    { id: 3, nome: "Cadeira de Escritório Ergo", categoria: "cadeiras", preco: 799.90, descricao: "Cadeira ergonômica com ajuste de altura e apoio lombar.", imagem: "https://via.placeholder.com/350x250/5bc0be/0a2e36?text=Cadeira+Ergo" },
    { id: 4, nome: "Poltrona Costela", categoria: "poltronas", preco: 1299.00, descricao: "Design clássico, em couro sintético e base de metal.", imagem: "https://via.placeholder.com/350x250/f0a500/0a2e36?text=Poltrona+Costela" }
];

const carrinhosDosUsuarios = {}; 
const usuariosCadastrados = {}; // Base de dados simulada de usuários

// --- ROTAS DA API ---

app.get('/api/produtos', (req, res) => {
    return res.json(produtos);
});

app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;
    
    const user = usuariosCadastrados[email];
    if (user && user.senha === senha) {
         return res.status(200).json({ 
            mensagem: `Login bem-sucedido para ${email}.`,
            userId: user.id, 
            token: 'simulated_jwt_token_12345'
        });
    } else if (email === 'teste@mail.com' && senha === '123456') {
         return res.status(200).json({ mensagem: `Login bem-sucedido para ${email}.`, userId: '123', token: 'simulated_jwt_token_12345' });
    } else {
        return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
    }
});

// Rota de Cadastro
app.post('/api/cadastro', (req, res) => {
    const { nome, email, senha } = req.body;
    
    if (usuariosCadastrados[email]) { 
        return res.status(409).json({ mensagem: 'Este email já está cadastrado.' });
    }
    
    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios.' });
    }
    
    const userId = Date.now().toString();
    usuariosCadastrados[email] = { id: userId, nome, email, senha };
    
    return res.status(201).json({ 
        mensagem: `Cadastro de ${nome} realizado com sucesso!`,
        userId: userId
    });
});


// Rotas de Carrinho...
app.post('/api/carrinho/:userId', (req, res) => {
    const userId = req.params.userId;
    const { carrinho } = req.body; 
    carrinhosDosUsuarios[userId] = carrinho;
    return res.status(200).json({ mensagem: 'Carrinho salvo com sucesso.' });
});

app.get('/api/carrinho/:userId', (req, res) => {
    const userId = req.params.userId;
    const carrinhoSalvo = carrinhosDosUsuarios[userId] || [];
    return res.status(200).json({ carrinho: carrinhoSalvo });
});


// --- INICIA O SERVIDOR ---
app.listen(PORT, () => {
    console.log(`🚀 API MoveisNac rodando em http://localhost:${PORT}`);
});