/**
 * Utilitário de formatação de texto e conversão de Markdown para HTML
 */
export function formatMarkdownToHTML(text) {
    if (!text) return '';

    let formatted = text;

    // Escapa caracteres HTML críticos para segurança
    formatted = formatted
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Blocos de Código (```linguagem ... ```)
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const languageClass = lang ? lang : '';
        return '<pre class="code-block"><code class="' + languageClass + '">' + code.trim() + '</code></pre>';
    });

    // Código em linha (`código`)
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // Títulos (# H1, ## H2, ### H3)
    formatted = formatted.replace(/^### (.*$)/gim, '<h3 class="md-h3">$1</h3>');
    formatted = formatted.replace(/^## (.*$)/gim, '<h2 class="md-h2">$1</h2>');
    formatted = formatted.replace(/^# (.*$)/gim, '<h1 class="md-h1">$1</h1>');

    // Negrito (**texto**)
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Itálico (*texto* ou _texto_)
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/_(.*?)_/g, '<em>$1</em>');

    // Listas com marcadores (- item ou * item)
    formatted = formatted.replace(/^\s*[-*]\s+(.*$)/gim, '<li class="md-li">$1</li>');
    formatted = formatted.replace(/(<li class="md-li">[\s\S]*?<\/li>)/gi, '<ul class="md-ul">$1</ul>');

    // Limpa substituições duplicadas de <ul> seguidos
    formatted = formatted.replace(/<\/ul>\s*<ul class="md-ul">/g, '');

    // Quebras de linha para parágrafos (<br>)
    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
}
