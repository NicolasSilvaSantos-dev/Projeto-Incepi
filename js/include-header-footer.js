// 1. Descobre a raiz correta do site ANTES de tudo (Escopo Global)
const repoName = window.location.pathname.split('/')[1];
const isGitHubPages = window.location.hostname.includes('github.io');
// Garante a barra inicial para caminhos absolutos corretos
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

        // CORREÇÃO DO REDIRECIONAMENTO E IMAGEM DA LOGO
        // 1. Busca a imagem do logo (se houver id="logo")
        const logoImg = document.getElementById('logo');
        if (logoImg) {
            logoImg.src = `${basePath}/assets/imagens/Logo.png`; 
        }

        // 2. CORREÇÃO CRÍTICA: Busca o link/âncora que envolve o logo e corrige o redirecionamento
        const logoLink = document.querySelector('.logo a');
        if (logoLink) {
            // Força o link do logo a apontar SEMPRE para a raiz (ex: / ou /nome-do-repositorio/)
            logoLink.href = isGitHubPages ? `${basePath}/index.html` : `/index.html`;
        }
        
        // 3. Corrige os demais links internos do menu
        const linksDinamicos = document.querySelectorAll('.caminho-relativo');
        linksDinamicos.forEach(link => {
            const hrefOriginal = link.getAttribute('href');
            link.href = `${basePath}/${hrefOriginal}`;
        });

        // Configurações do menu ativadas após a injeção do HTML
        destacarMenuAtivo();
        configurarMenuHamburguer();
    })
    .catch(error => console.error('Erro ao carregar header/footer:', error));
});

function configurarMenuHamburguer() {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector("#navbarsPrincipal");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            // Liga/Desliga a classe active nos elementos
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
            
            // Acessibilidade: atualiza o estado do leitor de tela
            const ariaExpanded = hamburger.getAttribute("aria-expanded") === "true";
            hamburger.setAttribute("aria-expanded", !ariaExpanded);
        });

        // Opcional: Fecha o menu se clicar em algum link interno
        document.querySelectorAll("#navbarsPrincipal a").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
            });
        });
    } else {
        console.warn("Elementos do menu hamburguer não foram encontrados no DOM.");
    }
}

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
