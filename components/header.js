/**
 * Renderiza o cabeçalho superior (Top Navbar) no container especificado
 * @param {string} targetSelector - Seletor CSS onde o cabeçalho será injetado
 */
export function renderHeader(targetSelector = '#header-container') {
    const container = document.querySelector(targetSelector);
    if (!container) return;

    container.innerHTML = `
        <header class="top-navbar">
            <div class="top-navbar-left">
                <button class="menu-open-btn" id="openSidebar" title="Abrir menu">
                    <i class="fi fi-rr-sidebar"></i>
                </button>
                <div class="search-bar-mini">
                    <i class="fi fi-rr-search"></i>
                    <input type="text" placeholder="Pesquisar...">
                </div>
            </div>

            <div class="top-navbar-right">
                <!-- Elementos do Usuário Logado -->
                <div class="logged-user-tools" id="loggedUserTools">
                    <div class="credits-badge">
                        <span>250</span>
                    </div>
                    <button class="upgrade-btn-top">Upgrade</button>
                </div>

                <!-- Elementos do Usuário Não Logado (Entrar / Conecte-se) -->
                <div class="guest-user-tools hidden" id="guestUserTools">
                    <a href="/auth/" class="btn-nav-login">Entrar</a>
                    <a href="/auth/cadastro/" class="btn-nav-signup">Conecte-se</a>
                </div>

                <!-- Botão de Alternância de Tema Dark / Light -->
                <button class="theme-toggle-btn" id="themeToggleBtn" title="Alternar Tema">
                    <i class="fi fi-rr-moon theme-icon-moon"></i>
                    <i class="fi fi-rr-sun theme-icon-sun"></i>
                </button>
            </div>
        </header>
    `;

    // Inicializa os ouvintes de eventos do cabeçalho
    initHeaderEvents();
}

function initHeaderEvents() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    
    // Restaurar tema salvo
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
}
