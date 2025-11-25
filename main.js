// main.js - CÓDIGO FINAL DE CARREGAMENTO DE PRODUTOS (Assíncrono)

// Variável global para armazenar os produtos carregados da API
// É CRÍTICA para o funcionamento do cart.js
window.produtos = []; 

/**
 * Renderiza a grade de produtos na página.
 */
function renderizarProdutos(produtosParaRenderizar) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    grid.innerHTML = ''; 

    if (produtosParaRenderizar.length === 0) {
         grid.innerHTML = '<p>Nenhum produto encontrado na API. Verifique o server.js.</p>';
         return;
    }

    produtosParaRenderizar.forEach(produto => {
        const precoFormatado = produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        // Garante que o src usa a URL do produto
        const imagemSrc = produto.imagem || 'https://via.placeholder.com/350x250?text=Sem+Imagem';

        const cardHTML = `
            <article class="product-card">
                <img src="${imagemSrc}" alt="${produto.nome}"> 
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


// CRÍTICO: Executa e espera pelo fetch antes de renderizar
document.addEventListener('DOMContentLoaded', async () => {
    const urlAPI = 'http://localhost:3000/api/produtos'; 

    try {
        const response = await fetch(urlAPI);
        
        if (!response.ok) {
            throw new Error(`Erro ao carregar produtos: ${response.status} ${response.statusText}`);
        }

        const produtosDaAPI = await response.json();
        
        // CRÍTICO: Define a variável global APÓS o carregamento
        window.produtos = produtosDaAPI;
        
        renderizarProdutos(produtosDaAPI); 

    } catch (error) {
        console.error("ERRO CRÍTICO ao carregar produtos:", error);
        const grid = document.getElementById('product-grid');
        if (grid) {
            grid.innerHTML = '<p class="error-message">⚠️ Não foi possível conectar ao servidor. Verifique se a API está online (node server.js).</p>';
        }
    } finally {
        // Atualiza o contador de qualquer forma
        await atualizarContadorCarrinho(); 
    }
});