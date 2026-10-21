/**
 * Renderiza o Footer no estilo AI no container especificado
 * @param {string} targetSelector - Seletor CSS do elemento onde o Footer será injetado
 */
export function renderFooter(targetSelector = '#footer-container') {
    const container = document.querySelector(targetSelector);
    if (!container) return;

    const currentYear = new Date().getFullYear();

    container.innerHTML = `
        <footer class="app-footer">
            <div class="footer-container">
                <div class="footer-top-grid">
                    <!-- Branding & Sobre -->
                    <div class="footer-brand">
                        <a href="#" class="footer-logo">
                            <img src="assets/logo.png" alt="FocoAI Logo" onerror="this.style.display='none'">
                            <span>FocoAI Studio</span>
                        </a>
                        <p class="footer-description">
                            Plataforma de inteligência artificial generativa para criação de anúncios, vídeos e soluções multimídia.
                        </p>
                    </div>

                    <!-- Coluna 1: Produto -->
                    <div class="footer-column">
                        <h4 class="footer-column-title">Produto</h4>
                        <ul class="footer-links">
                            <li><a href="#">Modelos AI</a></li>
                            <li><a href="#">FocoAI Wan 3.0 <span class="footer-badge">NOVO</span></a></li>
                            <li><a href="#">Gerador de Vídeo</a></li>
                            <li><a href="#">API & Integradores</a></li>
                            <li><a href="./plans/index.html">Preços & Planos</a></li>
                        </ul>
                    </div>

                    <!-- Coluna 2: Recursos & Suporte -->
                    <div class="footer-column">
                        <h4 class="footer-column-title">Recursos</h4>
                        <ul class="footer-links">
                            <li><a href="#">Documentação</a></li>
                            <li><a href="#">Galeria de Inspiração</a></li>
                            <li><a href="#">Changelog</a></li>
                            <li><a href="#">Status do Sistema</a></li>
                            <li><a href="#">Suporte & Ajuda</a></li>
                        </ul>
                    </div>

                    <!-- Coluna 3: Legal & Termos -->
                    <div class="footer-column">
                        <h4 class="footer-column-title">Legal</h4>
                        <ul class="footer-links">
                            <li><a href="#">Termos de Uso</a></li>
                            <li><a href="#">Política de Privacidade</a></li>
                            <li><a href="#">Direitos Autorais & Licenças</a></li>
                            <li><a href="#">Uso Aceitável de IA</a></li>
                            <li><a href="#">Preferências de Cookies</a></li>
                        </ul>
                    </div>
                </div>

                <div class="footer-divider"></div>

                <!-- Footer Bottom: Status + Direitos Autorais + Redes Sociais -->
                <div class="footer-bottom">
                    <div class="footer-status">
                        <span class="status-dot"></span>
                        <span>Todos os sistemas operacionais</span>
                    </div>

                    <div class="footer-legal-copyright">
                        <span>&copy; ${currentYear} FocoAI Studio. Todos os direitos reservados.</span>
                    </div>

                    <div class="footer-socials">
                        <a href="#" class="footer-social-btn" title="GitHub"><i class="fi fi-rr-code-compare"></i></a>
                        <a href="#" class="footer-social-btn" title="Twitter / X"><i class="fi fi-rr-share"></i></a>
                        <a href="#" class="footer-social-btn" title="Comunidade"><i class="fi fi-rr-users-alt"></i></a>
                    </div>
                </div>
            </div>
        </footer>
    `;
}
