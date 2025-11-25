alert("O ARQUIVO AUTH.JS FOI CARREGADO!");

const API_BASE_URL = 'http://localhost:3000'; 

// --- 1. TORNA A FUNÇÃO GLOBAL (Para funcionar com o onclick do HTML) ---
window.mostrarForm = function(formId) {
    console.log("Clicou na aba para mostrar:", formId); // Log para teste

    const formLogin = document.getElementById('form-login');
    const formCadastro = document.getElementById('form-cadastro');
    const formEsqueci = document.getElementById('form-esqueci');
    const tabLogin = document.getElementById('tab-login');
    const tabCadastro = document.getElementById('tab-cadastro');
    const formMessage = document.getElementById('form-message');

    // Esconde tudo e remove classes ativas
    if(formLogin) formLogin.style.display = 'none';
    if(formCadastro) formCadastro.style.display = 'none';
    if(formEsqueci) formEsqueci.style.display = 'none';
    if(tabLogin) tabLogin.classList.remove('active');
    if(tabCadastro) tabCadastro.classList.remove('active');
    
    // Limpa mensagens
    if(formMessage) {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
    }

    // Lógica de exibição
    if (formId === 'login') {
        if(formLogin) formLogin.style.display = 'block';
        if(tabLogin) tabLogin.classList.add('active');
    } else if (formId === 'cadastro') {
        if(formCadastro) formCadastro.style.display = 'block';
        if(tabCadastro) tabCadastro.classList.add('active');
    } else if (formId === 'esqueci') {
        if(formEsqueci) formEsqueci.style.display = 'block';
        if(tabLogin) tabLogin.classList.add('active'); 
    }
};

// --- 2. FUNÇÃO DE MENSAGEM ---
function mostrarMensagem(texto, tipo) {
    const formMessage = document.getElementById('form-message');
    if (!formMessage) return;

    formMessage.textContent = texto;
    formMessage.className = 'form-message ' + (tipo || '');
    formMessage.style.display = 'block';
}

// --- 3. EVENTOS DE FORMULÁRIO (Login e Cadastro) ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Auth.js carregado com sucesso!");

    // Garante que iniciamos no login
    window.mostrarForm('login');

    const formLogin = document.getElementById('form-login');
    const formCadastro = document.getElementById('form-cadastro');

    // --- LOGIN ---
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            console.log("Botão de Entrar clicado!");
            mostrarMensagem('Processando...', ''); 

            const email = document.getElementById('login-email').value;
            const senha = document.getElementById('login-senha').value;

            try {
                const response = await fetch(`${API_BASE_URL}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha })
                });
                const data = await response.json();

                if (response.ok) {
                    mostrarMensagem('Login OK! Redirecionando...', 'success');
                    localStorage.setItem('usuarioLogadoId', data.userId || '123');
                    setTimeout(() => window.location.href = 'index.html', 1500);
                } else {
                    mostrarMensagem(data.mensagem || 'Erro no login.', 'error');
                }
            } catch (err) {
                console.error(err);
                mostrarMensagem('Erro de conexão com servidor.', 'error');
            }
        });
    }

    // --- CADASTRO ---
    if (formCadastro) {
        formCadastro.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            console.log("Botão de Criar Conta clicado!");
            mostrarMensagem('Enviando dados...', '');

            // Pegando os valores com segurança
            const getVal = (id) => document.getElementById(id) ? document.getElementById(id).value : '';

            const nome = getVal('reg-nome');
            const email = getVal('reg-email');
            const telefone = getVal('reg-tel');
            const endereco = getVal('reg-endereco');
            const senha = getVal('reg-senha');
            const confirmaSenha = getVal('reg-confirma-senha');

            // Validações
            if (!nome || !email || !senha || !confirmaSenha) {
                mostrarMensagem('Preencha todos os campos obrigatórios (*)', 'error');
                return;
            }
            if (senha !== confirmaSenha) {
                mostrarMensagem('As senhas não coincidem.', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/cadastro`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email, telefone, endereco, senha, confirmaSenha })
                });
                const data = await response.json();

                if (response.ok) {
                    mostrarMensagem('Cadastro Sucesso! Faça login.', 'success');
                    setTimeout(() => {
                        window.mostrarForm('login');
                        if(document.getElementById('login-email')) document.getElementById('login-email').value = email;
                    }, 2000);
                } else {
                    mostrarMensagem(data.mensagem || 'Erro no cadastro.', 'error');
                }
            } catch (err) {
                console.error(err);
                mostrarMensagem('Erro: API offline ou inacessível.', 'error');
            }
        });
    }
});