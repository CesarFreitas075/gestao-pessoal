// modules/anotacoes.js
// VERSÃO COM LÓGICA DE MODAL CORRIGIDA E SIMPLIFICADA

const ANOTACOES_STORAGE_KEY = 'anotacoes';
let anotacoes = window.AppStorage.loadData(ANOTACOES_STORAGE_KEY) || [];

// Seed dummy data if storage is empty
if (anotacoes.length === 0) {
    anotacoes = [
        { id: Date.now() + 1, conteudo: 'Ideia para novo projeto\n\n- App de gestão de tarefas com foco em gamificação.' },
        { id: Date.now() + 2, conteudo: 'Lista de Compras\n- Arroz\n- Feijão\n- Macarrão\n- Azeite' },
        { id: Date.now() + 3, conteudo: 'Lembrete importante\nNão esquecer de ligar para o seguro do carro amanhã para renovar a apólice.' },
    ];
    window.AppStorage.saveData(ANOTACOES_STORAGE_KEY, anotacoes);
}

function salvarAnotacoes() {
    window.AppStorage.saveData(ANOTACOES_STORAGE_KEY, anotacoes);
}

// RENDERIZAÇÃO DA TELA PRINCIPAL
function renderAnotacoes(container) {
    container.innerHTML = `
        <div class="module-header">
            <img src="${APP_LOGO_PATH}" alt="Gestão Pessoal" class="app-logo">
            <h1 class="visually-hidden">Anotações</h1>
            <div class="header-actions">
                <button onclick="location.reload(true)" class="btn-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-refresh-cw"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                </button>
                <button onclick="abrirModalDeAnotacao()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
            </div>
        </div>
        <ul id="lista-anotacoes" class="wa-list"></ul>
    `;
    renderListaDeAnotacoes();
}

function renderListaDeAnotacoes() {
    const listaEl = document.getElementById('lista-anotacoes');
    if (!listaEl) return;
    listaEl.innerHTML = '';

    if (anotacoes.length === 0) {
        listaEl.innerHTML = '<li class="wa-list-item"><div class="item-content"><span class="item-title">Nenhuma anotação</span></div></li>';
        return;
    }

    [...anotacoes].sort((a, b) => b.id - a.id).forEach(anotacao => {
        const item = document.createElement('li');
        item.className = 'wa-list-item';
        item.onclick = () => abrirModalDeAnotacao(anotacao);

        const [primeiraLinha, ...resto] = anotacao.conteudo.split('\n');
        const subtitulo = resto.join(' ').substring(0, 50) + (resto.join(' ').length > 50 ? '...' : '');

        item.innerHTML = `
            <div class="item-content">
                <span class="item-title">${primeiraLinha || 'Anotação vazia'}</span>
                <span class="item-subtitle">${subtitulo || '...'}</span>
            </div>
            <div class="item-right"><span>></span></div>`;
        listaEl.appendChild(item);
    });
}

// --- LÓGICA DO MODAL (SIMPLIFICADA E GLOBAL) ---

function abrirModalDeAnotacao(anotacaoParaEditar = null) {
    const modal = document.getElementById('app-modal');
    document.getElementById('modal-title').textContent = anotacaoParaEditar ? 'Editar Anotação' : 'Nova Anotação';
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <form id="form-anotacao" onsubmit="event.preventDefault(); handleAnotacaoSubmit();">
            <input type="hidden" id="anotacao-id" value="${anotacaoParaEditar?.id || ''}">
            <div class="form-group form-group-vertical">
                <label>Conteúdo</label>
                <textarea id="anotacao-conteudo" required>${anotacaoParaEditar?.conteudo || ''}</textarea>
            </div>
            <button type="submit" class="btn">${anotacaoParaEditar ? 'Salvar' : 'Adicionar'}</button>
            ${anotacaoParaEditar ? `<button type="button" onclick="handleAnotacaoDelete(${anotacaoParaEditar.id})" class="btn btn-danger" style="margin-top: 10px;">Excluir</button>` : ''}
        </form>
    `;

    const textarea = document.getElementById('anotacao-conteudo');

    const autoGrow = () => {
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight) + 'px';
    };

    textarea.addEventListener('input', autoGrow);
    
    modal.classList.remove('hidden');
    textarea.focus();
    
    // Set initial height
    setTimeout(autoGrow, 0);

    // Attach close events
    const closeModalBtn = document.getElementById('modal-close-btn');
    closeModalBtn.onclick = window.closeModal;
    modal.onclick = (e) => {
        if (e.target === modal) {
            window.closeModal();
        }
    };
}

window.handleAnotacaoSubmit = () => {
    const form = document.getElementById('form-anotacao');
    const id = form.querySelector('#anotacao-id').value;
    const conteudo = form.querySelector('#anotacao-conteudo').value.trim();
    if (!conteudo) {
        showNotification('Escreva algo na anotação.', 'error');
        return;
    }

    if (id) {
        const anotacao = anotacoes.find(a => a.id === parseInt(id));
        if (anotacao) anotacao.conteudo = conteudo;
    } else {
        anotacoes.unshift({ id: Date.now(), conteudo });
    }
    
    salvarAnotacoes();
    window.closeModal();
    renderListaDeAnotacoes();
    showNotification('Anotação salva com sucesso!', 'success');
};

window.handleAnotacaoDelete = (id) => {
    if (confirm('Tem certeza?')) {
        anotacoes = anotacoes.filter(a => a.id !== id);
        salvarAnotacoes();
        window.closeModal();
        renderListaDeAnotacoes();
        showNotification('Anotação excluída com sucesso!', 'success');
    }
};

window.renderAnotacoes = renderAnotacoes;
window.abrirModalDeAnotacao = abrirModalDeAnotacao;

// Garante que a função de fechar modal esteja disponível globalmente
if (!window.closeModal) {
    window.closeModal = () => {
        document.getElementById('app-modal').classList.add('hidden');
        document.getElementById('modal-body').innerHTML = '';
    };
}