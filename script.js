import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, get, update, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Importação dos componentes modulares
import { renderHeader } from "./components/header.js";
import { renderSidebar } from "./components/sidebar.js";
import { renderChatInput } from "./components/chatInput.js";
import { renderAuthBottomSheet, showAuthBottomSheet } from "./components/authBottomSheet.js";
import { renderFooter } from "./components/footer.js";

// Importação da Memória da IA e do Formatador de Texto
import { SYSTEM_MEMORY } from "./dados/memory.js";
import { formatMarkdownToHTML } from "./dados/text.js";

// 1. Renderiza os componentes dinâmicos no DOM
renderHeader('#header-container');
renderSidebar('#sidebar-container');
renderAuthBottomSheet('#authBottomSheetContainer');
renderChatInput('#chatInputWrapper', handleMessageSubmit);
renderFooter('#footer-container');

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBBw75svJV-qRwCwUxG3fBMRoFKntgf_JI",
    authDomain: "focoia.firebaseapp.com",
    databaseURL: "https://focoia-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "focoia",
    storageBucket: "focoia.firebasestorage.app",
    messagingSenderId: "192542565436",
    appId: "1:192542565436:web:06ca4ab95cec22463b0f39",
    measurementId: "G-71F3K9NX6T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Elementos da Interface
const closeBanner = document.getElementById('closeBanner');
const announcementBanner = document.querySelector('.announcement-banner');
const chatResults = document.getElementById('chatResults');
const heroSection = document.getElementById('heroSection');
const chatInputWrapper = document.getElementById('chatInputWrapper');
const workspace = document.getElementById('workspace');

// Elementos do Modal de Logout
const logoutModal = document.getElementById('logoutModal');
const cancelLogoutBtn = document.getElementById('cancelLogoutBtn');
const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');

// Constantes do Sistema de Pontos
const COST_TEXT = 30;
const COST_IMAGE = 100;
const RESTORE_AMOUNT = 250;
const RESTORE_INTERVAL_MS = 5 * 60 * 60 * 1000; // 5 horas em milissegundos

// Variável local para controle do usuário logado e seus créditos
let currentUserData = null;

// --------------------------------------------------------------------------
// LÓGICA DE GERENCIAMENTO E RESTAURAÇÃO DE PONTOS
// --------------------------------------------------------------------------

/**
 * Calcula e aplica a restauração dos pontos com base no tempo decorrido (5 horas).
 */
async function syncAndGetCredits(uid) {
    const userRef = ref(db, 'users/' + uid);
    const snapshot = await get(userRef);
    const now = Date.now();

    if (!snapshot.exists()) {
        const initialData = {
            credits: RESTORE_AMOUNT,
            lastRestoredAt: now,
            createdAt: new Date().toISOString()
        };
        await set(userRef, initialData);
        currentUserData = initialData;
        updateCreditsUI(RESTORE_AMOUNT);
        return RESTORE_AMOUNT;
    }

    let userData = snapshot.val();
    let currentCredits = userData.credits !== undefined ? userData.credits : RESTORE_AMOUNT;
    let lastRestoredAt = userData.lastRestoredAt || now;

    // Verificar quantas janelas de 5 horas se passaram
    const timePassed = now - lastRestoredAt;
    if (timePassed >= RESTORE_INTERVAL_MS) {
        const intervals = Math.floor(timePassed / RESTORE_INTERVAL_MS);
        currentCredits += intervals * RESTORE_AMOUNT;
        // Atualiza a marca temporal proporcionalmente aos intervalos aplicados
        lastRestoredAt += intervals * RESTORE_INTERVAL_MS;

        await update(userRef, {
            credits: currentCredits,
            lastRestoredAt: lastRestoredAt
        });
    }

    currentUserData = { ...userData, credits: currentCredits, lastRestoredAt };
    updateCreditsUI(currentCredits);
    return currentCredits;
}

/**
 * Atualiza os pontos na interface (cabeçalho e popover)
 */
function updateCreditsUI(credits) {
    const creditsEl = document.querySelector('.credits-badge span');
    if (creditsEl) {
        creditsEl.textContent = credits;
    }
}

/**
 * Deduz os pontos do banco de dados do usuário
 */
async function deductCredits(uid, cost) {
    const currentCredits = await syncAndGetCredits(uid);
    if (currentCredits < cost) return false;

    const newCredits = currentCredits - cost;
    const userRef = ref(db, 'users/' + uid);

    await update(userRef, { credits: newCredits });
    if (currentUserData) currentUserData.credits = newCredits;
    updateCreditsUI(newCredits);
    return true;
}

// --------------------------------------------------------------------------
// GERENCIAMENTO DO MODAL DE LOGOUT
// --------------------------------------------------------------------------
document.addEventListener('click', (e) => {
    if (e.target.closest('#logoutBtn')) {
        const profilePopover = document.getElementById('profilePopover');
        if (profilePopover) profilePopover.classList.remove('active');
        if (logoutModal) logoutModal.classList.add('active');
    }
});

if (cancelLogoutBtn) {
    cancelLogoutBtn.addEventListener('click', () => {
        if (logoutModal) logoutModal.classList.remove('active');
    });
}

if (logoutModal) {
    logoutModal.addEventListener('click', (e) => {
        if (e.target === logoutModal) logoutModal.classList.remove('active');
    });
}

if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            if (logoutModal) logoutModal.classList.remove('active');
            window.location.reload();
        } catch (error) {
            console.error("Erro ao encerrar sessão:", error);
        }
    });
}

// --------------------------------------------------------------------------
// OBSERVAR ESTADO DE AUTENTICAÇÃO E ATUALIZAR DADOS DO USUÁRIO
// --------------------------------------------------------------------------
onAuthStateChanged(auth, async (user) => {
    const loggedUserTools = document.getElementById('loggedUserTools');
    const guestUserTools = document.getElementById('guestUserTools');
    const userAccountBtn = document.getElementById('userAccountBtn');
    const guestSidebarActions = document.getElementById('guestSidebarActions');
    const heroGreetingText = document.getElementById('heroGreetingText');

    if (user) {
        if (loggedUserTools) loggedUserTools.classList.remove('hidden');
        if (guestUserTools) guestUserTools.classList.add('hidden');
        if (userAccountBtn) userAccountBtn.classList.remove('hidden');
        if (guestSidebarActions) guestSidebarActions.classList.add('hidden');

        let accountName = user.displayName;
        let username = user.email ? user.email.split('@')[0] : 'usuario';
        let plan = 'Pessoal · Gratuito';

        // Garante a sincronização e restauração automática de pontos ao conectar
        const currentCredits = await syncAndGetCredits(user.uid);

        try {
            const userRef = ref(db, 'users/' + user.uid);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
                const userData = snapshot.val();
                accountName = userData.displayName || userData.username || accountName;
                username = userData.username || username;
                plan = userData.plan || plan;
            }
        } catch (err) {
            console.error("Erro ao carregar dados do banco:", err);
        }

        const finalDisplayName = accountName || username;

        if (heroGreetingText) {
            heroGreetingText.textContent = `Olá, ${finalDisplayName}!`;
        }

        const accountNameEl = document.querySelector('.account-name');
        const popoverUserNameEl = document.querySelector('.popover-user-name');
        const popoverUserEmailEl = document.querySelector('.popover-user-email');
        const accountPlanEl = document.querySelector('.account-plan');
        const avatarEl = document.querySelector('.user-avatar-img');

        if (accountNameEl) accountNameEl.textContent = finalDisplayName;
        if (popoverUserNameEl) popoverUserNameEl.textContent = finalDisplayName;
        if (popoverUserEmailEl) popoverUserEmailEl.textContent = user.email || '';
        if (accountPlanEl) accountPlanEl.textContent = plan;

        if (avatarEl) {
            const initials = finalDisplayName
                .trim()
                .split(' ')
                .map(n => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase();
            avatarEl.textContent = initials || 'U';
        }

    } else {
        currentUserData = null;
        if (loggedUserTools) loggedUserTools.classList.add('hidden');
        if (guestUserTools) guestUserTools.classList.remove('hidden');
        if (userAccountBtn) userAccountBtn.classList.add('hidden');
        if (guestSidebarActions) guestSidebarActions.classList.remove('hidden');

        if (heroGreetingText) {
            heroGreetingText.textContent = 'Olá, Visitante!';
        }
    }
});

if (closeBanner) closeBanner.addEventListener('click', () => announcementBanner.style.display = 'none');

// Redirecionamento ao clicar nos botões de Upgrade do Cabeçalho e Banner
document.addEventListener('click', (e) => {
    if (e.target.closest('.upgrade-btn-top') || e.target.closest('.banner-upgrade-btn')) {
        window.location.href = './plans/index.html';
    }
});

// --------------------------------------------------------------------------
// FLUXO DE MENSAGENS E INTEGRAÇÃO COM A API
// --------------------------------------------------------------------------
let messageHistory = [ SYSTEM_MEMORY ];
let isChatStarted = false;

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

async function handleMessageSubmit({ text, files, model }) {
    if (!text && files.length === 0) return;

    if (!auth.currentUser) {
        showAuthBottomSheet();
        return;
    }

    const uid = auth.currentUser.uid;
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    const docFiles = files.filter(f => !f.type.startsWith('image/'));

    // 1. Calcular o custo necessário da operação
    const hasImage = imageFiles.length > 0;
    const requiredCost = hasImage ? COST_IMAGE : COST_TEXT;

    // 2. Verificar o saldo de pontos atual com auto-restauração por tempo
    const availableCredits = await syncAndGetCredits(uid);

    if (availableCredits < requiredCost) {
        alert(`Pontos insuficientes! O envio de ${hasImage ? 'imagem exige 100' : 'texto exige 30'} pontos. Você será redirecionado para os planos.`);
        window.location.href = './plans/index.html';
        return;
    }

    // 3. Deduzir pontos do usuário
    const deducted = await deductCredits(uid, requiredCost);
    if (!deducted) {
        alert("Pontos insuficientes. Redirecionando para os planos...");
        window.location.href = './plans/index.html';
        return;
    }

            if (!isChatStarted) {
        isChatStarted = true;
        const heroBrandHeader = heroSection.querySelector('.hero-brand-header');
        const heroTitle = heroSection.querySelector('.hero-title');
        const quickChipsGrid = document.getElementById('quickChipsGrid');
        const inspirationSection = document.getElementById('inspirationSection');
        const footerContainer = document.getElementById('footer-container'); // <--- Pega o container do Footer

        if (heroBrandHeader) heroBrandHeader.style.display = 'none';
        if (heroTitle) heroTitle.style.display = 'none';
        if (quickChipsGrid) quickChipsGrid.style.display = 'none';
        if (inspirationSection) inspirationSection.style.display = 'none';
        if (footerContainer) footerContainer.style.display = 'none'; // <--- Oculta o Footer ao iniciar o Chat

        // Fixa a barra de chat e ajusta a classe na workspace
        chatInputWrapper.classList.add('fixed-bottom');
        workspace.classList.add('chat-active');
    }

    let apiMessageContent = [];
    let imageBase64List = [];

    for (const img of imageFiles) {
        const base64Url = await fileToBase64(img);
        imageBase64List.push(base64Url);
        apiMessageContent.push({
            type: "image_url",
            image_url: { url: base64Url }
        });
    }

    const textPrompt = text || (imageFiles.length > 0 ? "Analise esta imagem." : "");
    apiMessageContent.push({ type: "text", text: textPrompt });

    appendMessage({
        text: textPrompt,
        images: imageBase64List,
        docFiles: docFiles.map(f => f.name)
    }, 'user');

    messageHistory.push({
        role: 'user',
        content: imageFiles.length > 0 ? apiMessageContent : textPrompt
    });

    const typingId = showTypingIndicator();
    const selectedModel = imageFiles.length > 0 ? "qwen/qwen3.8-27b" : (model || "openai/gpt-oss-120b");

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: selectedModel,
                messages: messageHistory,
                temperature: 0.7,
                max_tokens: 2048
            })
        });

        removeTypingIndicator(typingId);

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || 'Erro ao processar requisição.');
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        appendMessage({ text: aiResponse }, 'ai');
        messageHistory.push({ role: 'assistant', content: aiResponse });

    } catch (error) {
        removeTypingIndicator(typingId);
        appendMessage({ text: `⚠️ Erro: ${error.message}` }, 'ai');
    }
}

function appendMessage(payload, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message', sender);

    if (sender === 'user') {
        let imagesHTML = '';
        if (payload.images && payload.images.length > 0) {
            imagesHTML = `<div class="chat-message-images-grid">` +
                payload.images.map(img => `<img src="${img}" class="chat-msg-img-thumb" alt="Imagem enviada">`).join('') +
                `</div>`;
        }

        let docHTML = '';
        if (payload.docFiles && payload.docFiles.length > 0) {
            docHTML = `<small style="opacity: 0.8; display: block; margin-top: 4px;">Anexos: ${payload.docFiles.join(', ')}</small>`;
        }

        msgDiv.innerHTML = `
            <div class="message-bubble">
                ${imagesHTML}
                ${payload.text ? payload.text.replace(/\n/g, '<br>') : ''}
                ${docHTML}
            </div>
        `;
    } else {
        const formattedHTML = formatMarkdownToHTML(payload.text);

        msgDiv.innerHTML = `
            <div class="message-bubble">${formattedHTML}</div>
            <div class="chat-ai-actions">
                <button class="ai-action-btn" title="Gostei"><i class="hgi-stroke hgi-thumbs-up"></i></button>
                <button class="ai-action-btn" title="Não gostei"><i class="hgi-stroke hgi-thumbs-down"></i></button>
            </div>
        `;
    }

    chatResults.appendChild(msgDiv);
    workspace.scrollTop = workspace.scrollHeight;
}

function showTypingIndicator() {
    const id = 'typing-' + Date.now();
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message', 'ai');
    msgDiv.id = id;
    msgDiv.innerHTML = `
        <div class="thinking-indicator">
            <div class="thinking-spinner"></div>
            <span>Pensando...</span>
        </div>
    `;
    chatResults.appendChild(msgDiv);
    workspace.scrollTop = workspace.scrollHeight;
    return id;
}

function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}
