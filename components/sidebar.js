/**
 * Renderiza o menu lateral (Sidebar) e o backdrop mobile no container especificado
 * @param {string} targetSelector - Seletor CSS onde a sidebar será injetada
 */
export function renderSidebar(targetSelector = '#sidebar-container') {
    const container = document.querySelector(targetSelector);
    if (!container) return;

    container.innerHTML = `
        <div class="sidebar-backdrop" id="sidebarBackdrop"></div>

        <aside class="sidebar" id="sidebar">
            <div class="sidebar-top">
                <button class="sidebar-toggle-btn" id="closeSidebar" title="Fechar menu">
                    <i class="fi fi-rr-sidebar"></i>
                </button>
            </div>

            <button class="new-chat-btn" id="newChatBtn">
                <i class="fi fi-rr-plus"></i>
                <span>Novo Chat</span>
                <i class="fi fi-rr-angle-small-down dropdown-icon"></i>
            </button>

            <nav class="sidebar-nav">
                <a href="#" class="nav-item active"><i class="fi fi-rr-home"></i> Início</a>
                <a href="#" class="nav-item"><i class="fi fi-rr-magic-wand"></i> Ferramentas</a>
                <a href="#" class="nav-item"><i class="fi fi-rr-apps"></i> Aplicativos</a>
                <a href="#" class="nav-item"><i class="fi fi-rr-workflow"></i> Fluxos de Trabalho</a>
            </nav>

            <div class="sidebar-section-divider"></div>

            <nav class="sidebar-nav">
                <a href="#" class="nav-item"><i class="fi fi-rr-folder"></i> Arquivos</a>
                <a href="#" class="nav-item"><i class="fi fi-rr-label"></i> Marca</a>
            </nav>

            <div class="chat-mode-toggle">
                <button class="mode-btn active"><i class="fi fi-rr-comment"></i> Chat</button>
                <button class="mode-btn"><i class="fi fi-rr-dashboard"></i> Sessão</button>
            </div>

            <div class="recents-container">
                <div class="recents-header">
                    <span>Recentes</span>
                    <button class="add-recent-btn"><i class="fi fi-rr-plus"></i></button>
                </div>
                <ul class="recents-list">
                    <li class="recent-item"><span>Assistente FocoAI</span></li>
                </ul>
            </div>

            <div class="sidebar-promo-card">
                <div class="promo-icon"><i class="fi fi-rr-gift"></i></div>
                <div class="promo-text">
                    <strong>Obtenha o plano FocoAI Max grátis</strong>
                    <p>Afiliados ativos ganham Max grátis e $15 por indicação</p>
                </div>
                <button class="promo-close"><i class="fi fi-rr-cross-small"></i></button>
            </div>

            <!-- Footer da Sidebar (Logado / Convidado) -->
            <div class="sidebar-footer">
                <!-- Estado Logado -->
                <div class="user-account" id="userAccountBtn">
                    <div class="user-avatar-img">U</div>
                    <div class="user-details">
                        <span class="account-name">Usuário</span>
                        <span class="account-plan">Pessoal · Gratuito</span>
                    </div>
                    <i class="fi fi-rr-angle-small-down"></i>
                </div>

                <!-- Estado Convidado / Deslogado -->
                <div class="guest-account-actions hidden" id="guestSidebarActions">
                    <a href="auth/login/index.html" class="btn-guest-login">Entrar</a>
                    <a href="auth/cadastro/index.html" class="btn-guest-signup">Cadastre-se</a>
                </div>

                <!-- Popover do Perfil -->
                <div class="profile-popover" id="profilePopover">
                    <div class="popover-header">
                        <span class="popover-user-name">Usuário</span>
                        <span class="popover-user-email">email@focoai.com</span>
                    </div>
                    <div class="popover-divider"></div>
                    <div class="popover-menu">
                        <button class="popover-item"><i class="fi fi-rr-user"></i> Meu Perfil</button>
                        <button class="popover-item"><i class="fi fi-rr-settings"></i> Configurações</button>
                        <button class="popover-item"><i class="fi fi-rr-credit-card"></i> Planos e Cobrança</button>
                        <div class="popover-divider"></div>
                        <button class="popover-item logout-item" id="logoutBtn">
                            <i class="fi fi-rr-sign-out-alt"></i> Sair da Conta
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    `;

    // Inicializa eventos da Sidebar
    initSidebarEvents();
}

function initSidebarEvents() {
    const sidebar = document.getElementById('sidebar');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');
    const closeSidebarBtn = document.getElementById('closeSidebar');

    function closeMenu() {
        if (sidebar) sidebar.classList.remove('open');
        if (sidebarBackdrop) sidebarBackdrop.classList.remove('open');
    }

    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeMenu);
    if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeMenu);

    document.addEventListener('click', (e) => {
        if (e.target.closest('#openSidebar')) {
            if (sidebar) sidebar.classList.add('open');
            if (sidebarBackdrop) sidebarBackdrop.classList.add('open');
        }
    });

    // Controle do Popover do Perfil
    const userAccountBtn = document.getElementById('userAccountBtn');
    const profilePopover = document.getElementById('profilePopover');
    const logoutBtn = document.getElementById('logoutBtn');

    if (userAccountBtn && profilePopover) {
        userAccountBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profilePopover.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!profilePopover.contains(e.target) && !userAccountBtn.contains(e.target)) {
                profilePopover.classList.remove('active');
            }
        });
    }

    if (logoutBtn && profilePopover) {
        logoutBtn.addEventListener('click', () => {
            profilePopover.classList.remove('active');
        });
    }
}
