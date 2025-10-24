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
    // Atualiza o subtotal se estiver na página do carrinho
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
    const carrinho = getCarrinho();
    // Encontra o produto no nosso "banco de dados" de produtos
    const produto = produtos.find(p => p.id === produtoId);

    if (!produto) return;

    const itemExistente = carrinho.find(item => item.id === produtoId);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }

    salvarCarrinho(carrinho);
    // Feedback visual
    alert(`${produto.nome} foi adicionado ao carrinho!`);
}

/**
 * Remove um item do carrinho.
 * @param {number} produtoId - O ID do produto a ser removido.
 */
function removerDoCarrinho(produtoId) {
    let carrinho = getCarrinho();
    carrinho = carrinho.filter(item => item.id !== produtoId);
    salvarCarrinho(carrinho);
    
    // Re-renderiza a lista de itens (só funciona na pág. do carrinho)
    renderizarItensCarrinho();
}

/**
 * Altera a quantidade de um item no carrinho.
 * @param {number} produtoId - O ID do produto.
 * @param {number} novaQuantidade - A nova quantidade.
 */
function alterarQuantidade(produtoId, novaQuantidade) {
    const carrinho = getCarrinho();
    const item = carrinho.find(item => item.id === produtoId);
    novaQuantidade = Number(novaQuantidade);

    if (item) {
        if (novaQuantidade <= 0) {
            // Se a quantidade for 0 ou menos, remove o item
            removerDoCarrinho(produtoId);
        } else {
            item.quantidade = novaQuantidade;
            salvarCarrinho(carrinho);
        }
    }
}

/**
 * Renderiza os itens do carrinho na página carrinho.html.
 */
function renderizarItensCarrinho() {
    const container = document.getElementById('cart-items-list');
    const msgVazio = document.getElementById('cart-empty-msg');
    
    // Verifica se estamos na página certa
    if (!container) return; 

    const carrinho = getCarrinho();
    
    if (carrinho.length === 0) {
        msgVazio.style.display = 'block';
        container.innerHTML = ''; // Limpa os itens antigos
        container.appendChild(msgVazio); // Re-adiciona a msg
    } else {
        msgVazio.style.display = 'none';
        container.innerHTML = ''; // Limpa (remove a msg de vazio)
        
        carrinho.forEach(item => {
            const itemHTML = `
                <div class="cart-item">
                    <img src="${item.imagem}" alt="${item.nome}">
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
    }
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