/**
 * Renderiza e gerencia os eventos da Barra de Mensagem ajustada
 */
export function renderChatInput(targetSelector = '#chatInputWrapper', onSubmitCallback) {
    const container = document.querySelector(targetSelector);
    if (!container) return;

    container.innerHTML = `
        <div class="prompt-box-card" id="promptCard">
            <!-- Área de Prévias Modernas -->
            <div class="attachments-preview-container hidden" id="attachmentsPreview"></div>

            <!-- Formulário Principal -->
            <form id="chatForm" autocomplete="off">
                <input type="file" id="fileAttachmentInput" multiple accept="image/*,.pdf,.txt,.doc,.docx" class="hidden">

                <textarea id="userInput" placeholder="Ask me anything..." rows="1"></textarea>
                
                <div class="prompt-bottom-row">
                    <div class="prompt-left-tools">
                        <button type="button" class="tool-icon-minimal" id="attachFileBtn" title="Anexar arquivo ou imagem">
                            <i class="fi fi-rr-picture"></i>
                        </button>

                        <button type="button" class="prompt-action-pill" id="btnDeepSearch">
                            <i class="fi fi-rr-search"></i> Pesquisar
                        </button>

                        <button type="button" class="prompt-action-pill" id="btnReason">
                            <i class="fi fi-rr-bulb"></i> Reason
                        </button>
                    </div>

                    <div class="prompt-right-tools">
                        <button type="submit" class="send-prompt-btn-img" id="sendBtn" title="Enviar mensagem">
                            <i class="fi fi-rr-arrow-small-up"></i>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `;

    initChatInputEvents(onSubmitCallback);
}

function initChatInputEvents(onSubmitCallback) {
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const attachFileBtn = document.getElementById('attachFileBtn');
    const fileAttachmentInput = document.getElementById('fileAttachmentInput');
    const attachmentsPreview = document.getElementById('attachmentsPreview');

    let attachedFiles = [];

    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        checkActiveSend();
    });

    function checkActiveSend() {
        const hasText = userInput.value.trim().length > 0;
        const hasFiles = attachedFiles.length > 0;
        if (hasText || hasFiles) {
            sendBtn.classList.add('active');
        } else {
            sendBtn.classList.remove('active');
        }
    }

    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    });

    if (attachFileBtn && fileAttachmentInput) {
        attachFileBtn.addEventListener('click', () => fileAttachmentInput.click());

        fileAttachmentInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                if (!attachedFiles.some(f => f.name === file.name)) {
                    attachedFiles.push(file);
                }
            });
            renderFilePreviews();
            checkActiveSend();
        });
    }

    // Renderiza a Prévia Moderna de Arquivos e Imagens
    function renderFilePreviews() {
        if (attachedFiles.length === 0) {
            attachmentsPreview.classList.add('hidden');
            attachmentsPreview.innerHTML = '';
            return;
        }

        attachmentsPreview.classList.remove('hidden');
        attachmentsPreview.innerHTML = '';

        attachedFiles.forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                // Card de Imagem com Thumbnail
                const imageUrl = URL.createObjectURL(file);
                const card = document.createElement('div');
                card.className = 'image-preview-card';
                card.innerHTML = `
                    <img src="${imageUrl}" alt="${file.name}">
                    <div class="preview-remove-overlay remove-file-btn" data-index="${index}">
                        <i class="fi fi-rr-cross-small"></i>
                    </div>
                `;
                attachmentsPreview.appendChild(card);
            } else {
                // Card de Documento
                const card = document.createElement('div');
                card.className = 'file-preview-card';
                card.innerHTML = `
                    <i class="fi fi-rr-document"></i>
                    <span class="file-name">${file.name}</span>
                    <i class="fi fi-rr-cross-small remove-file-btn" data-index="${index}"></i>
                `;
                attachmentsPreview.appendChild(card);
            }
        });

        // Eventos para remover arquivos da prévia
        document.querySelectorAll('.remove-file-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                attachedFiles.splice(idx, 1);
                renderFilePreviews();
                checkActiveSend();
            });
        });
    }

    // Ações rápidas
    document.getElementById('btnDeepSearch')?.addEventListener('click', () => {
        userInput.value += ' [Deep Search] ';
        userInput.focus();
        checkActiveSend();
    });

    document.getElementById('btnReason')?.addEventListener('click', () => {
        userInput.value += ' [Reason] ';
        userInput.focus();
        checkActiveSend();
    });

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = userInput.value.trim();

        if (!text && attachedFiles.length === 0) return;

        if (typeof onSubmitCallback === 'function') {
            onSubmitCallback({
                text: text,
                files: [...attachedFiles],
                model: "qwen/qwen3.8-27b"
            });
        }

        userInput.value = '';
        userInput.style.height = 'auto';
        attachedFiles = [];
        renderFilePreviews();
        checkActiveSend();
    });
}
