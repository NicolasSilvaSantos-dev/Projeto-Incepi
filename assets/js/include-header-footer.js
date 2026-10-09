// 1. Descobre a raiz correta do site ANTES de tudo (Escopo Global)
const repoName = window.location.pathname.split('/')[1];
const isGitHubPages = window.location.hostname.includes('github.io');
const basePath = isGitHubPages ? `/${repoName}` : '';

document.addEventListener('DOMContentLoaded', () => {
    // 2. Busca simultaneamente usando o basePath correto
    Promise.all([
        fetch(`${basePath}/components/header.html`).then(res => {
            if (!res.ok) throw new Error('Erro ao carregar o header');
            return res.text();
        }),
        fetch(`${basePath}/components/footer.html`).then(res => {
            if (!res.ok) throw new Error('Erro ao carregar o footer');
            return res.text();
        })
    ])
    .then(([headerHtml, footerHtml]) => {
        // 3. Injeta o Header no INÍCIO do body e o Footer no FINAL
        document.body.insertAdjacentHTML('afterbegin', headerHtml);
        document.body.insertAdjacentHTML('beforeend', footerHtml);

        // 4. Executa a marcação do menu ativo DEPOIS que o HTML foi injetado
        destacarMenuAtivo();
    })
    .catch(error => console.error('Erro ao carregar header/footer:', error));
});

function destacarMenuAtivo() {
    let paginaAtual = window.location.pathname.toLowerCase();

    // Se estiver na raiz, padroniza para index.html
    if (paginaAtual === '/' || paginaAtual === '' || paginaAtual === `${basePath.toLowerCase()}/`) {
        paginaAtual = '/index.html';
    }

    const links = document.querySelectorAll('#navbarsPrincipal ul li a');

    links.forEach(link => {
        let linkHref = link.getAttribute('href');
        if (!linkHref) return;
        
        linkHref = linkHref.toLowerCase();
        link.classList.remove('active');

        // Ajuste na lógica para remover caminhos relativos ao comparar
        const linkLimpo = linkHref.replace(/^\.\.\/|^\.\//, '');

        // 1. REGRA PARA PÁGINAS INDIVIDUAIS DE PRODUTOS
        if (paginaAtual.includes('/pages/produtos/') && linkLimpo.includes('produtos.html')) {
            link.classList.add('active');
            return;
        }

        // 2. REGRA PADRÃO PARA AS DEMAIS PÁGINAS
        if (paginaAtual.endsWith(linkLimpo) || paginaAtual === linkLimpo) {
            link.classList.add('active');
        }
    });
}
