/**
 * Componente AuthBottomSheet
 * Gerencia a renderização e animações do Bottom Sheet de autenticação com visual moderno
 */
export function renderAuthBottomSheet(targetSelector = '#authBottomSheetContainer') {
    let container = document.querySelector(targetSelector);
    
    if (!container) {
        container = document.createElement('div');
        container.id = 'authBottomSheetContainer';
        document.body.appendChild(container);
    }

    container.innerHTML = `
        <div class="bottom-sheet-backdrop" id="authBottomSheetBackdrop">
            <div class="bottom-sheet-card" id="authBottomSheetCard">
                <!-- Barra de Toque/Arrasto Visual -->
                <div class="bottom-sheet-drag-handle"></div>
                
                <!-- Botão Fechar -->
                <button class="bottom-sheet-close-btn" id="closeAuthSheetBtn" aria-label="Fechar modal">
                    <i class="fi fi-rr-cross-small"></i>
                </button>
                
                <!-- Novo Card Hero Tecnológico & Profissional -->
                <div class="sheet-hero-card">
                    <div class="sheet-hero-header">
                        <div class="sheet-hero-icon-wrapper">
                            <i class="fi fi-rr-comment-alt"></i>
                        </div>
                        <div class="sheet-badge-credits">
                            <i class="fi fi-rr-sparkles"></i>
                            <span>500 Créditos Grátis</span>
                        </div>
                    </div>
                    <div class="sheet-hero-title">Desbloqueie todo o potencial do FocoAI</div>
                    <div class="sheet-hero-desc">Crie anúncios, analise dados e gere conteúdo com modelos GPT de última geração.</div>
                </div>

                <!-- Textos Principais -->
                <h3 class="sheet-prompt-title">Sua geração está a um passo</h3>
                <p class="sheet-prompt-subtitle">Crie sua conta em poucos segundos para continuar conversando com a IA.</p>

                <!-- Botões de Ação -->
                <a href="auth/cadastro/index.html" class="sheet-prompt-signup-btn">Cadastrar Gratuitamente</a>

                <!-- Rodapé de Login -->
                <p class="sheet-prompt-footer">Já tem uma conta? <a href="auth/login/index.html">Entrar</a></p>
            </div>
        </div>
    `;

    initBottomSheetEvents();
}

/**
 * Inicializa os eventos do Bottom Sheet
 */
function initBottomSheetEvents() {
    const backdrop = document.getElementById('authBottomSheetBackdrop');
    const closeBtn = document.getElementById('closeAuthSheetBtn');

    if (closeBtn) {
        closeBtn.addEventListener('click', hideAuthBottomSheet);
    }

    if (backdrop) {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                hideAuthBottomSheet();
            }
        });
    }
}

/**
 * Exibe o Bottom Sheet com animação
 */
export function showAuthBottomSheet() {
    const backdrop = document.getElementById('authBottomSheetBackdrop');
    if (backdrop) {
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Oculta o Bottom Sheet com animação
 */
export function hideAuthBottomSheet() {
    const backdrop = document.getElementById('authBottomSheetBackdrop');
    if (backdrop) {
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
    }
}
