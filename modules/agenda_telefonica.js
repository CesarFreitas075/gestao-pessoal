// modules/agenda_telefonica.js

const AGENDA_STORAGE_KEY = 'agenda_telefonica';
let contatos = window.AppStorage.loadData(AGENDA_STORAGE_KEY) || [];

function salvarContatos() {
    window.AppStorage.saveData(AGENDA_STORAGE_KEY, contatos);
}

function getContactIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
}

function renderAgendaTelefonica(container) {
    container.innerHTML = `
        <div class="module-header">
            <h1 class="module-title">Agenda Telefônica</h1>
            <div class="header-actions">
                <button onclick="abrirModalDeContato()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
            </div>
        </div>
        <ul id="lista-contatos" class="wa-list"></ul>
    `;
    renderListaContatos();
}

function renderListaContatos() {
    const listaEl = document.getElementById('lista-contatos');
    listaEl.innerHTML = '';

    if (contatos.length === 0) {
        listaEl.innerHTML = '<li class="wa-list-item" style="opacity: 1; animation: none;"><div class="item-content"><span class="item-title">Nenhum contato na agenda</span></div></li>';
        return;
    }

    contatos.sort((a, b) => a.nome.localeCompare(b.nome)).forEach(contato => {
        const item = document.createElement('li');
        item.className = 'wa-list-item';
        item.onclick = () => abrirModalDeContato(contato);

        item.innerHTML = `
            <div class="item-icon">${getContactIcon()}</div>
            <div class="item-content">
                <span class="item-title">${contato.nome}</span>
                <span class="item-subtitle">${contato.telefone}</span>
            </div>
            <div class="item-right">
                <a href="tel:${contato.telefone}" class="btn-icon" onclick="event.stopPropagation();">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </a>
            </div>
        `;
        listaEl.appendChild(item);
    });
}

function abrirModalDeContato(contatoParaEditar = null) {
    const modal = document.getElementById('app-modal');
    document.getElementById('modal-title').textContent = contatoParaEditar ? 'Editar Contato' : 'Novo Contato';

    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <form id="form-contato" onsubmit="event.preventDefault(); handleContatoSubmit();">
            <input type="hidden" id="contato-id" value="${contatoParaEditar?.id || ''}">
            
            <div class="form-section">
                <div class="form-group"><label>Nome</label><input type="text" id="contato-nome" required value="${contatoParaEditar?.nome || ''}"></div>
                <div class="form-group"><label>Telefone</label><input type="tel" id="contato-telefone" required value="${contatoParaEditar?.telefone || ''}"></div>
                <div class="form-group"><label>Email</label><input type="email" id="contato-email" value="${contatoParaEditar?.email || ''}"></div>
            </div>
            
            <button type="submit" class="btn">${contatoParaEditar ? 'Salvar Alterações' : 'Adicionar Contato'}</button>
            ${contatoParaEditar ? `<button type="button" onclick="handleContatoDelete(${contatoParaEditar.id})" class="btn btn-danger" style="margin-top: 10px;">Excluir Contato</button>` : ''}
        </form>
    `;
    modal.classList.remove('hidden');

    const closeModalBtn = document.getElementById('modal-close-btn');
    closeModalBtn.onclick = window.closeModal;
    modal.onclick = (e) => { if (e.target === modal) window.closeModal(); };
}

window.handleContatoSubmit = () => {
    const form = document.getElementById('form-contato');
    const id = form.querySelector('#contato-id').value;

    const contato = {
        id: id ? parseInt(id) : Date.now(),
        nome: form.querySelector('#contato-nome').value.trim(),
        telefone: form.querySelector('#contato-telefone').value.trim(),
        email: form.querySelector('#contato-email').value.trim(),
    };

    if (!contato.nome || !contato.telefone) {
        showNotification('Nome e telefone são obrigatórios.', 'error');
        return;
    }

    const index = contatos.findIndex(c => c.id === contato.id);
    if (index > -1) {
        contatos[index] = contato;
    } else {
        contatos.push(contato);
    }
    
    salvarContatos();
    closeModal();
    renderListaContatos();
    showNotification('Contato salvo com sucesso!', 'success');
};

window.handleContatoDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este contato?')) {
        contatos = contatos.filter(c => c.id !== id);
        salvarContatos();
        closeModal();
        renderListaContatos();
        showNotification('Contato excluído com sucesso!', 'success');
    }
};

window.renderAgendaTelefonica = renderAgendaTelefonica;
window.abrirModalDeContato = abrirModalDeContato;
