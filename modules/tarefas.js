// modules/tarefas.js
// VERSÃO COM LÓGICA DE MODAL CORRIGIDA E SIMPLIFICADA

const TAREFAS_STORAGE_KEY = 'tarefas';
let tarefas = window.AppStorage.loadData(TAREFAS_STORAGE_KEY) || [];

// Seed dummy data if storage is empty
if (tarefas.length === 0) {
    tarefas = [
        { id: Date.now() + 1, descricao: 'Comprar leite e pão', concluida: false },
        { id: Date.now() + 2, descricao: 'Ligar para o cliente X', concluida: false },
        { id: Date.now() + 3, descricao: 'Agendar reunião de equipe para sexta-feira', concluida: false },
        { id: Date.now() + 4, descricao: 'Terminar relatório de vendas', concluida: true },
        { id: Date.now() + 5, descricao: 'Pagar conta de luz', concluida: false },
    ];
    window.AppStorage.saveData(TAREFAS_STORAGE_KEY, tarefas);
}

function salvarTarefas() {
    window.AppStorage.saveData(TAREFAS_STORAGE_KEY, tarefas);
}

// RENDERIZAÇÃO DA TELA PRINCIPAL
function renderTarefas(container) {
    container.innerHTML = `
        <div class="module-header">
            <img src="${APP_LOGO_PATH}" alt="Gestão Pessoal" class="app-logo">
            <h1 class="visually-hidden">Tarefas</h1>
            <div class="header-actions">
                <button onclick="location.reload(true)" class="btn-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-refresh-cw"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                </button>
                <button onclick="abrirModalDeTarefa()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
            </div>
        </div>
        <ul id="lista-tarefas" class="wa-list"></ul>
    `;
    renderListaDeTarefas();
}

function renderListaDeTarefas() {
    const listaEl = document.getElementById('lista-tarefas');
    if (!listaEl) return;
    listaEl.innerHTML = '';

    if (tarefas.length === 0) {
        listaEl.innerHTML = '<li class="wa-list-item"><div class="item-content"><span class="item-title">Nenhuma tarefa</span></div></li>';
        return;
    }
    
    const pendentes = tarefas.filter(t => !t.concluida);
    const concluidas = tarefas.filter(t => t.concluida);
    [...pendentes, ...concluidas].forEach(tarefa => {
        const item = document.createElement('li');
        item.className = 'wa-list-item';
        if (tarefa.concluida) item.style.opacity = '0.5';

        const checkbox = document.createElement('div');
        checkbox.className = `wa-checkbox ${tarefa.concluida ? 'checked' : ''}`;
        checkbox.innerHTML = tarefa.concluida ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>' : '';
        checkbox.onclick = (e) => {
            e.stopPropagation();
            alternarConclusao(tarefa.id);
        };

        const content = document.createElement('div');
        content.className = 'item-content';
        content.innerHTML = `<span class="item-title" style="${tarefa.concluida ? 'text-decoration: line-through;' : ''}">${tarefa.descricao}</span>`;
        
        item.appendChild(checkbox);
        item.appendChild(content);
        item.addEventListener('click', () => abrirModalDeTarefa(tarefa));
        listaEl.appendChild(item);
    });
}

// --- LÓGICA DO MODAL (SIMPLIFICADA E GLOBAL) ---

function abrirModalDeTarefa(tarefaParaEditar = null) {
    const modal = document.getElementById('app-modal');
    document.getElementById('modal-title').textContent = tarefaParaEditar ? 'Editar Tarefa' : 'Nova Tarefa';
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <form id="form-tarefa" onsubmit="event.preventDefault(); handleTarefaSubmit();">
            <input type="hidden" id="tarefa-id" value="${tarefaParaEditar?.id || ''}">
            <div class="form-group">
                <label>Descrição</label>
                <input type="text" id="tarefa-descricao" required value="${tarefaParaEditar?.descricao || ''}">
            </div>
            <button type="submit" class="btn">${tarefaParaEditar ? 'Salvar' : 'Adicionar'}</button>
            ${tarefaParaEditar ? `<button type="button" onclick="handleTarefaDelete(${tarefaParaEditar.id})" class="btn btn-danger" style="margin-top: 10px;">Excluir</button>` : ''}
        </form>
    `;
    modal.classList.remove('hidden');
    document.getElementById('tarefa-descricao').focus();

    // Attach close events
    const closeModalBtn = document.getElementById('modal-close-btn');
    closeModalBtn.onclick = window.closeModal;
    modal.onclick = (e) => {
        if (e.target === modal) {
            window.closeModal();
        }
    };
}

window.handleTarefaSubmit = () => {
    const form = document.getElementById('form-tarefa');
    const id = form.querySelector('#tarefa-id').value;
    const descricao = form.querySelector('#tarefa-descricao').value.trim();
    if (!descricao) {
        showNotification('Digite a descrição.', 'error');
        return;
    }

    if (id) {
        const tarefa = tarefas.find(t => t.id === parseInt(id));
        if (tarefa) tarefa.descricao = descricao;
    } else {
        tarefas.push({ id: Date.now(), descricao, concluida: false });
    }
    salvarTarefas();
    window.closeModal();
    renderListaDeTarefas();
    showNotification('Tarefa salva com sucesso!', 'success');
};

window.handleTarefaDelete = (id) => {
    if (confirm('Tem certeza?')) {
        tarefas = tarefas.filter(t => t.id !== id);
        salvarTarefas();
        window.closeModal();
        renderListaDeTarefas();
        showNotification('Tarefa excluída com sucesso!', 'success');
    }
};

function alternarConclusao(id) {
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa) {
        tarefa.concluida = !tarefa.concluida;
        salvarTarefas();
        renderListaDeTarefas();
        showNotification(tarefa.concluida ? 'Tarefa concluída!' : 'Tarefa marcada como pendente.', 'info');
    }
}

window.renderTarefas = renderTarefas;
window.abrirModalDeTarefa = abrirModalDeTarefa;

// Funções de fechar modal (já devem estar no escopo global)
// Se não, descomente a seguinte linha:
// window.closeModal = () => { document.getElementById('app-modal').classList.add('hidden'); document.getElementById('modal-body').innerHTML = ''; };