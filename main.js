// main.js

// Executa quando o HTML da página inicial está 100% carregado
document.addEventListener('DOMContentLoaded', () => {
    renderizarProdutos(produtos); 
    atualizarContadorCarrinho();
});

/**
 * Renderiza a grade de produtos na página.
 * @param {Array} produtosParaRenderizar - O array de produtos a ser exibido.
 */
function renderizarProdutos(produtosParaRenderizar) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    grid.innerHTML = ''; // Limpa o grid

    produtosParaRenderizar.forEach(produto => {
        
        // Formata o preço para BRL
        const precoFormatado = produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        const cardHTML = `
            <article class="product-card">
                <img src="${produto.imagem}" alt="${produto.nome}">
                <div class="product-card-content">
                    <h3>${produto.nome}</h3>
                    <p class="product-card-desc">${produto.descricao}</p>
                    <div class="product-card-price">${precoFormatado}</div>
                    <button class="btn btn-primario" onclick="adicionarAoCarrinho(${produto.id})">
                        Adicionar ao Carrinho
                    </button>
                </div>
            </article>
        `;
        grid.innerHTML += cardHTML;
    });
}