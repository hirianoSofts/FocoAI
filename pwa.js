/**
 * Gerenciador de PWA para FocoAI Studio
 */

let deferredPrompt = null;

// 1. Registo do Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => {
                console.log('FocoAI Service Worker registrado com sucesso:', reg.scope);
            })
            .catch(err => {
                console.error('Falha ao registrar Service Worker:', err);
            });
    });
}

// 2. Captura do Evento de Instalação PWA (beforeinstallprompt)
window.addEventListener('beforeinstallprompt', (e) => {
    // Previne a barra padrão do navegador
    e.preventDefault();
    deferredPrompt = e;

    // Atualiza os botões "Baixar App" na interface
    const installBtns = document.querySelectorAll('#installPwaBtn, .get-app-btn');
    installBtns.forEach(btn => {
        btn.style.display = 'flex';
        btn.addEventListener('click', triggerPwaInstall);
    });
});

/**
 * Dispara o prompt de instalação
 */
async function triggerPwaInstall() {
    if (!deferredPrompt) {
        alert('O aplicativo já está instalado ou o seu navegador não suporta a instalação direta.');
        return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
        console.log('Usuário aceitou instalar o FocoAI Studio PWA');
    } else {
        console.log('Usuário recusou a instalação do PWA');
    }

    deferredPrompt = null;
}

// 3. Detectar se o aplicativo já está rodando como PWA instalado
window.addEventListener('appinstalled', () => {
    console.log('FocoAI Studio foi instalado com sucesso!');
    const getAppCard = document.querySelector('.get-app-card');
    if (getAppCard) {
        getAppCard.style.display = 'none'; // Esconde a barra se já estiver instalado
    }
});
