# FocoPrime AI

Interface responsiva de chat em HTML, CSS e JavaScript, com fonte DM Sans, ícones Hugeicons e integração direta com a API compatível com OpenAI da Groq.

## Executar
1. Extrai o ZIP.
2. Abre `index.html` no navegador. Para melhores resultados, serve a pasta através de um servidor estático local.
3. Abre **Configurações**, cria uma chave em GroqCloud e cola-a no campo da chave.
4. Escolhe o modelo e guarda.

## Segurança — importante
A chave API partilhada na conversa não foi incluída no ZIP. **Revoga essa chave e cria uma nova**, porque uma chave exposta deve ser considerada comprometida.
Esta versão guarda a chave no `localStorage` do navegador e chama a Groq diretamente do frontend. Isto é conveniente para testes pessoais, mas não é seguro para publicar como site público: qualquer pessoa com acesso ao navegador/site pode extrair a chave. Para produção, cria um backend/serverless endpoint e guarda a chave numa variável de ambiente no servidor.

## Conteúdo
- `index.html` — estrutura e interface
- `styles.css` — estilo responsivo
- `app.js` — chat, estado de conversa e chamada Groq
- `assets/focoprime-mark.png` — símbolo fornecido

## Notas
- O histórico existe apenas durante a sessão atual.
- Os modelos disponíveis na Groq podem mudar; se um modelo deixar de estar disponível, escolhe outro nas configurações.
- A ligação à API requer internet.
