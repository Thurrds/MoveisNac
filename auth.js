// auth.js

// Referências aos formulários e abas
const formLogin = document.getElementById('form-login');
const formCadastro = document.getElementById('form-cadastro');
const formEsqueci = document.getElementById('form-esqueci');

const tabLogin = document.getElementById('tab-login');
const tabCadastro = document.getElementById('tab-cadastro');

const formMessage = document.getElementById('form-message');

/**
 * Alterna a exibição dos formulários (Login, Cadastro, Esqueci).
 * @param {'login' | 'cadastro' | 'esqueci'} formId 
 */
function mostrarForm(formId) {
    // Esconde todos os formulários
    formLogin.style.display = 'none';
    formCadastro.style.display = 'none';
    formEsqueci.style.display = 'none';
    
    // Desativa todas as abas
    tabLogin.classList.remove('active');
    tabCadastro.classList.remove('active');
    
    // Limpa mensagens de erro
    mostrarMensagem('', 'limpar');

    // Mostra o formulário e ativa a aba correspondente
    if (formId === 'login') {
        formLogin.style.display = 'block';
        tabLogin.classList.add('active');
    } else if (formId === 'cadastro') {
        formCadastro.style.display = 'block';
        tabCadastro.classList.add('active');
    } else if (formId === 'esqueci') {
        formEsqueci.style.display = 'block';
        // Mantém a aba de login ativa ou nenhuma
        tabLogin.classList.add('active'); 
    }
}

/**
 * Exibe uma mensagem de feedback (erro ou sucesso) no topo do formulário.
 * @param {string} texto - A mensagem a ser exibida.
 * @param {'error' | 'success' | 'limpar'} tipo - O tipo da mensagem.
 */
function mostrarMensagem(texto, tipo) {
    formMessage.textContent = texto;
    formMessage.className = 'form-message'; // Reseta as classes

    if (tipo === 'error') {
        formMessage.classList.add('error');
    } else if (tipo === 'success') {
        formMessage.classList.add('success');
    }
    // Se for 'limpar', ele só reseta (fica invisível)
}


// --- Lógica de Eventos (Listeners) ---
// Adiciona os 'escutadores' apenas se os formulários existirem (estamos na pág. login.html)
if (formLogin) {
    
    // --- SIMULAÇÃO DE LOGIN ---
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o envio real do formulário
        mostrarMensagem('', 'limpar'); // Limpa erros anteriores
        
        const email = document.getElementById('login-email').value;
        const senha = document.getElementById('login-senha').value;

        // SIMULAÇÃO: Aceita um usuário "admin"
        if (email === 'arthur@moveisnac.com' && senha === '1234') {
            mostrarMensagem('Login bem-sucedido! Redirecionando...', 'success');
            
            // Simula o redirecionamento após 2 segundos
            setTimeout(() => {
                window.location.href = 'index.html'; // Redireciona para a Home
            }, 2000);
        } else {
            mostrarMensagem('Email ou senha inválidos. Tente (arthur@moveisnac.com / 1234)', 'error');
        }
    });

    // --- VALIDAÇÃO E SIMULAÇÃO DE CADASTRO ---
    formCadastro.addEventListener('submit', (e) => {
        e.preventDefault();
        mostrarMensagem('', 'limpar');

        // Pega os valores dos campos
        const nome = document.getElementById('reg-nome').value;
        const email = document.getElementById('reg-email').value;
        const senha = document.getElementById('reg-senha').value;
        const confirmaSenha = document.getElementById('reg-confirma-senha').value;

        // 1. Validação de campos vazios
        if (!nome || !email || !senha || !confirmaSenha) {
            mostrarMensagem('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        // 2. Validação de senhas
        if (senha !== confirmaSenha) {
            mostrarMensagem('As senhas não coincidem.', 'error');
            return;
        }
        
        // 3. Validação de força da senha (simples)
        if (senha.length < 6) {
            mostrarMensagem('A senha deve ter pelo menos 6 caracteres.', 'error');
            return;
        }

        // 4. SUCESSO!
        mostrarMensagem(`Cadastro de ${nome} realizado com sucesso! Você já pode fazer o login.`, 'success');
        
        // Simula o "sucesso" limpando o formulário e voltando ao login
        setTimeout(() => {
            formCadastro.reset(); // Limpa os campos
            mostrarForm('login'); // Mostra o form de login
            document.getElementById('login-email').value = email; // Preenche o email para facilitar
        }, 3000);
    });

    // --- SIMULAÇÃO DE "ESQUECI SENHA" ---
    formEsqueci.addEventListener('submit', (e) => {
        e.preventDefault();
        mostrarMensagem('', 'limpar');

        const email = document.getElementById('esqueci-email').value;
        if (!email) {
            mostrarMensagem('Por favor, informe seu email.', 'error');
            return;
        }

        // SIMULAÇÃO
        mostrarMensagem(`(Simulado) Um email de recuperação foi enviado para ${email}.`, 'success');
        
        setTimeout(() => {
            mostrarForm('login');
        }, 3000);
    });
}