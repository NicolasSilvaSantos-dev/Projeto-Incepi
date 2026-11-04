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
        const logoLink = document.querySelector('.logo-link');
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
        injetarBotaoWhatsApp();
        const elementoAnos = document.getElementById('anos-empresa');
        if (elementoAnos) {
            const anoFundacao = 1989;
            const anoAtual = new Date().getFullYear(); // Pega o ano atual do sistema do usuário
            const idadeEmpresa = anoAtual - anoFundacao;
            
            // Injeta o número calculado diretamente no HTML
            elementoAnos.textContent = idadeEmpresa;
        }
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

// ==========================================================================
// ADIÇÃO DO BOTÃO FLUTUANTE DO WHATSAPP
// ==========================================================================
function injetarBotaoWhatsApp() {
    // Defina o número de telefone aqui (apenas números com DDD, ex: 5511999999999)
    const numeroWhatsApp = "5511947554640";
    
    // Mensagem padrão codificada para URL
    const mensagemPadrao = encodeURIComponent("Olá! Vim através do site da Incepi do Brasil e gostaria de mais informações.");

    const somWhatsApp = new Audio("assets/audio/ding_whats.mp3");
    somWhatsApp.preload = "auto";
    somWhatsApp.volume = 0.2;
    
    // Cria o elemento do botão flutuante
    const whatsappBtn = document.createElement('a');
    whatsappBtn.href = `https://wa.me/${numeroWhatsApp}?text=${mensagemPadrao}`;
    whatsappBtn.target = "_blank";
    whatsappBtn.rel = "noopener noreferrer";
    whatsappBtn.className = "whatsapp-flutuante";
    whatsappBtn.setAttribute("aria-label", "Falar no WhatsApp com a Incepi do Brasil");

    // Ícone SVG do WhatsApp integrado diretamente
    whatsappBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="32" height="32" fill="#ffffff">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.6-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
        </svg>
    `;

    whatsappBtn.addEventListener("click", () => {
        somWhatsApp.currentTime = 0; // Reinicia o som caso seja clicado novamente
        somWhatsApp.play().catch((erro) => {
            console.warn("Não foi possível reproduzir o áudio:", erro);
        });
    });

    document.body.appendChild(whatsappBtn);
}
