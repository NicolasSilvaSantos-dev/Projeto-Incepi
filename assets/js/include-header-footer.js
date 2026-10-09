document.addEventListener('DOMContentLoaded', () => {
    // Busca simultaneamente o header e o footer
    Promise.all([
        fetch('components/header.html').then(res => res.text()),
        fetch('components/footer.html').then(res => res.text())
    ])
    .then(([headerHtml, footerHtml]) => {
        // 1. Injeta o Header no INÍCIO do body
        document.body.insertAdjacentHTML('afterbegin', headerHtml);

        // 2. Injeta o Footer no FINAL do body
        document.body.insertAdjacentHTML('beforeend', footerHtml);

        // 3. Executa a marcação do menu ativo
        destacarMenuAtivo();
    })
    .catch(error => console.error('Erro ao carregar header/footer:', error));
});

function destacarMenuAtivo() {
    // Obtém o caminho da URL atual em minúsculas
    let paginaAtual = window.location.pathname.toLowerCase();

    // Trata a raiz do site para coincidir com /index.html
    if (paginaAtual === '/' || paginaAtual === '') {
        paginaAtual = '/index.html';
    }

    const links = document.querySelectorAll('#navbarsPrincipal ul li a');

    links.forEach(link => {
        const linkHref = link.getAttribute('href').toLowerCase();

        // Remove a classe 'active' antes de verificar
        link.classList.remove('active');

        // 1. REGRA PARA PÁGINAS INDIVIDUAIS DE PRODUTOS (/pages/produtos/nome-do-produto.html):
        // Se a URL atual estiver dentro da pasta "/pages/produtos/"
        if (paginaAtual.includes('/pages/produtos/') && linkHref.includes('produtos.html')) {
            link.classList.add('active');
            return;
        }

        // 2. REGRA PADRÃO PARA AS DEMAIS PÁGINAS
        if (linkHref && (paginaAtual.endsWith(linkHref) || linkHref === paginaAtual)) {
            link.classList.add('active');
        }
    });
}