// cart.js

// --- Funções de Utilitário do Carrinho ---

/**
 * Pega o carrinho do localStorage.
 * @returns {Array} O carrinho (um array de objetos).
 */
function getCarrinho() {
    return JSON.parse(localStorage.getItem('moveisNacCart')) || [];
}

/**
 * Salva o carrinho no localStorage.
 * @param {Array} carrinho - O array do carrinho a ser salvo.
 */
function salvarCarrinho(carrinho) {
    localStorage.setItem('moveisNacCart', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
    if (document.getElementById('cart-subtotal')) {
        calcularSubtotal();
    }
}

/**
 * Atualiza o número no ícone do carrinho no header.
 */
function atualizarContadorCarrinho() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const carrinho = getCarrinho();
        const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
        cartCountElement.textContent = totalItens;
    }
}

// --- Funções Principais de Ação ---

/**
 * Adiciona um produto ao carrinho.
 * @param {number} produtoId - O ID do produto a ser adicionado.
 */
function adicionarAoCarrinho(produtoId) {
    // A variável 'produtos' deve estar definida em 'produtos.js'
    if (typeof produtos === 'undefined') {
        console.error("A lista de produtos (produtos.js) não está carregada.");
        return;
    }
    
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) {
        console.error("Produto não encontrado.");
        return;
    }

    const carrinho = getCarrinho();
    const itemExistente = carrinho.find(item => item.id === produtoId);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem, 
            quantidade: 1
        });
    }

    salvarCarrinho(carrinho);
    alert(`"${produto.nome}" adicionado ao carrinho!`);
}

/**
 * Remove um item completamente do carrinho.
 * @param {number} produtoId - O ID do produto a ser removido.
 */
function removerDoCarrinho(produtoId) {
    let carrinho = getCarrinho();
    carrinho = carrinho.filter(item => item.id !== produtoId);
    salvarCarrinho(carrinho);
    // Se estiver na página do carrinho, renderiza novamente
    if (document.getElementById('cart-items-list')) {
        renderizarItensCarrinho();
    }
}

/**
 * Altera a quantidade de um item no carrinho.
 * @param {number} produtoId - O ID do produto.
 * @param {number} novaQuantidade - A nova quantidade.
 */
function alterarQuantidade(produtoId, novaQuantidade) {
    let quantidade = parseInt(novaQuantidade);
    if (isNaN(quantidade) || quantidade <= 0) {
        removerDoCarrinho(produtoId);
        return;
    }
    
    const carrinho = getCarrinho();
    const item = carrinho.find(item => item.id === produtoId);
    
    if (item) {
        item.quantidade = quantidade;
        salvarCarrinho(carrinho);
    }
}

// --- Funções de Renderização (para carrinho.html) ---

/**
 * Renderiza a lista de itens na página do carrinho.
 */
function renderizarItensCarrinho() {
    const container = document.getElementById('cart-items-list');
    const msgVazio = document.getElementById('cart-empty-msg');
    
    if (!container) return;

    const carrinho = getCarrinho();
    container.innerHTML = ''; // Limpa o container
    
    if (carrinho.length === 0) {
        if (msgVazio) msgVazio.style.display = 'block';
        calcularSubtotal(); // Para garantir que o total é R$ 0,00
        return;
    }
    
    if (msgVazio) msgVazio.style.display = 'none';

    carrinho.forEach(item => {
        const itemHTML = `
            <div class="cart-item">
                <img src="${item.imagem}" alt="${item.nome}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4>${item.nome}</h4>
                    <p class="price">R$ ${item.preco.toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <input 
                        type="number" 
                        value="${item.quantidade}" 
                        min="1"
                        onchange="alterarQuantidade(${item.id}, this.value)"
                        aria-label="Quantidade de ${item.nome}"
                    >
                    <button class="btn-remover" onclick="removerDoCarrinho(${item.id})" aria-label="Remover ${item.nome}">
                        Remover
                    </button>
                </div>
            </div>
        `;
        container.innerHTML += itemHTML;
    });

    // Calcula o subtotal após renderizar
    calcularSubtotal();
}

/**
 * Calcula e exibe o subtotal na página do carrinho.
 */
function calcularSubtotal() {
    const subtotalElement = document.getElementById('cart-subtotal');
    if (!subtotalElement) return;

    const carrinho = getCarrinho();
    const subtotal = carrinho.reduce((total, item) => {
        return total + (item.preco * item.quantidade);
    }, 0);

    // Formata como moeda brasileira
    subtotalElement.textContent = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}