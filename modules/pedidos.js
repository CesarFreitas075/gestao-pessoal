// modules/pedidos.js

const PEDIDOS_STORAGE_KEY = 'pedidos';
let pedidos = window.AppStorage.loadData(PEDIDOS_STORAGE_KEY) || [];

// Seed dummy data if storage is empty
if (pedidos.length === 0) {
    const today = new Date().toISOString().slice(0, 10);
    pedidos = [
        { id: Date.now() + 1, solicitante: 'João Silva', dataSolicitacao: today, endereco: 'Rua A, 123', tipoServico: 'Manutenção de Computador', status: 'SOLICITADO' },
        { id: Date.now() + 2, solicitante: 'Maria Oliveira', dataSolicitacao: today, endereco: 'Av. B, 456', tipoServico: 'Instalação de Software', status: 'EM ANDAMENTO' },
        { id: Date.now() + 3, solicitante: 'Carlos Pereira', dataSolicitacao: today, endereco: 'Travessa C, 789', tipoServico: 'Consultoria de Rede', status: 'FINALIZADO' },
        { id: Date.now() + 4, solicitante: 'Ana Costa', dataSolicitacao: today, endereco: 'Praça D, 101', tipoServico: 'Formatação de PC', status: 'SOLICITADO' },
    ];
    window.AppStorage.saveData(PEDIDOS_STORAGE_KEY, pedidos);
}


function salvarPedidos() {
    window.AppStorage.saveData(PEDIDOS_STORAGE_KEY, pedidos);
}

function getStatusStyle(status) {
    switch (status) {
        case 'SOLICITADO': return 'color: var(--color-primary);'; // Purple
        case 'EM ANDAMENTO': return 'color: var(--color-secondary);'; // Pink
        case 'FINALIZADO': return 'color: var(--ios-green);'; // Green
        default: return '';
    }
}

// RENDERIZAÇÃO DA TELA PRINCIPAL
function renderPedidos(container) {
    container.innerHTML = `
        <div class="module-header">
            <img src="${APP_LOGO_PATH}" alt="Gestão Pessoal" class="app-logo">
            <h1 class="visually-hidden">Pedidos</h1>
            <div class="header-actions">
                <button onclick="location.reload(true)" class="btn-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-refresh-cw"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                </button>
                <button onclick="abrirModalDePedido()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
            </div>
        </div>
        <ul id="lista-pedidos" class="wa-list"></ul>
    `;
    renderListaDePedidos();
}

function renderListaDePedidos() {
    const listaEl = document.getElementById('lista-pedidos');
    if (!listaEl) return;
    listaEl.innerHTML = '';

    if (pedidos.length === 0) {
        listaEl.innerHTML = '<li class="wa-list-item" style="animation: none; opacity: 1;"><div class="item-content"><span class="item-title">Nenhum pedido</span></div></li>';
        return;
    }

    [...pedidos].sort((a, b) => new Date(b.dataSolicitacao) - new Date(a.dataSolicitacao)).forEach((pedido, index) => {
        const item = document.createElement('li');
        item.className = 'wa-list-item';
        item.onclick = () => abrirModalDeVisualizacao(pedido); // Changed this line
        item.style.animationDelay = `${index * 0.05}s`;

        const dataFormatada = new Date(pedido.dataSolicitacao + 'T00:00:00-03:00').toLocaleDateString('pt-BR');

        item.innerHTML = `
            <div class="item-content">
                <span class="item-title">${pedido.solicitante} - ${pedido.tipoServico}</span>
                <span class="item-subtitle">${dataFormatada} - <span style="${getStatusStyle(pedido.status)}">${pedido.status}</span></span>
            </div>
            <div class="item-right">
                <span>></span>
            </div>`;
        listaEl.appendChild(item);
    });
}

function abrirModalDeVisualizacao(pedido) {
    const modal = document.getElementById('app-modal');
    document.getElementById('modal-title').textContent = 'Detalhes do Pedido';
    
    const modalBody = document.getElementById('modal-body');
    const dataFormatada = new Date(pedido.dataSolicitacao + 'T00:00:00-03:00').toLocaleDateString('pt-BR');

    modalBody.innerHTML = `
        <div class="view-section">
            <div class="view-item">
                <span class="view-label">Solicitante</span>
                <span class="view-value">${pedido.solicitante}</span>
            </div>
            <div class="view-item">
                <span class="view-label">Data da Solicitação</span>
                <span class="view-value">${dataFormatada}</span>
            </div>
            <div class="view-item">
                <span class="view-label">Endereço</span>
                <span class="view-value">${pedido.endereco}</span>
            </div>
            <div class="view-item">
                <span class="view-label">Tipo de Serviço</span>
                <span class="view-value">${pedido.tipoServico}</span>
            </div>
            <div class="view-item">
                <span class="view-label">Status</span>
                <span class="view-value" style="${getStatusStyle(pedido.status)}">${pedido.status}</span>
            </div>
        </div>
        <button id="edit-pedido-btn" class="btn">Editar</button>
    `;

    document.getElementById('edit-pedido-btn').onclick = () => abrirModalDePedido(pedido);
    
    modal.classList.remove('hidden');
    // Attach close events
    const closeModalBtn = document.getElementById('modal-close-btn');
    closeModalBtn.onclick = window.closeModal;
    modal.onclick = (e) => { if (e.target === modal) window.closeModal(); };
}

// --- LÓGICA DO MODAL ---

function abrirModalDePedido(pedidoParaEditar = null) {
    const modal = document.getElementById('app-modal');
    document.getElementById('modal-title').textContent = pedidoParaEditar ? 'Editar Pedido' : 'Novo Pedido';
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <form id="form-pedido" onsubmit="event.preventDefault(); handlePedidoSubmit();">
            <input type="hidden" id="pedido-id" value="${pedidoParaEditar?.id || ''}">
            
            <div class="form-section">
                <div class="form-group"><label>Solicitante</label><input type="text" id="pedido-solicitante" required value="${pedidoParaEditar?.solicitante || ''}"></div>
                <div class="form-group"><label>Data</label><input type="date" id="pedido-data-solicitacao" required value="${pedidoParaEditar?.dataSolicitacao || new Date().toISOString().slice(0, 10)}"></div>
                <div class="form-group"><label>Endereço</label><input type="text" id="pedido-endereco" required value="${pedidoParaEditar?.endereco || ''}"></div>
                <div class="form-group"><label>Tipo de Serviço</label><input type="text" id="pedido-tipo-servico" required value="${pedidoParaEditar?.tipoServico || ''}"></div>
            </div>

            <div class="form-section">
                <div class="form-group"><label>Status</label></div>
                <div class="category-chips">
                    <label><input type="radio" name="pedido-status" value="SOLICITADO" ${pedidoParaEditar?.status === 'SOLICITADO' ? 'checked' : ''} required><span>SOLICITADO</span></label>
                    <label><input type="radio" name="pedido-status" value="EM ANDAMENTO" ${pedidoParaEditar?.status === 'EM ANDAMENTO' ? 'checked' : ''}><span>EM ANDAMENTO</span></label>
                    <label><input type="radio" name="pedido-status" value="FINALIZADO" ${pedidoParaEditar?.status === 'FINALIZADO' ? 'checked' : ''}><span>FINALIZADO</span></label>
                </div>
            </div>
            
            <button type="submit" class="btn">${pedidoParaEditar ? 'Salvar Alterações' : 'Adicionar Pedido'}</button>
            ${pedidoParaEditar ? `<button type="button" onclick="handlePedidoDelete(${pedidoParaEditar.id})" class="btn btn-danger" style="margin-top: 10px;">Excluir Pedido</button>` : ''}
        </form>
    `;
    modal.classList.remove('hidden');
    // Attach close events
    const closeModalBtn = document.getElementById('modal-close-btn');
    closeModalBtn.onclick = window.closeModal;
    modal.onclick = (e) => { if (e.target === modal) window.closeModal(); };
}
window.handlePedidoSubmit = () => {
    const form = document.getElementById('form-pedido');
    const id = form.querySelector('#pedido-id').value;
    const status = form.querySelector('input[name="pedido-status"]:checked');
    if (!status) {
        showNotification('Selecione um status.', 'error');
        return;
    }

    const pedido = {
        id: id ? parseInt(id) : Date.now(),
        solicitante: form.querySelector('#pedido-solicitante').value.trim(),
        dataSolicitacao: form.querySelector('#pedido-data-solicitacao').value,
        endereco: form.querySelector('#pedido-endereco').value.trim(),
        tipoServico: form.querySelector('#pedido-tipo-servico').value.trim(),
        status: status.value,
    };

    if (!pedido.solicitante || !pedido.dataSolicitacao || !pedido.endereco || !pedido.tipoServico) {
        showNotification('Preencha todos os campos corretamente.', 'error');
        return;
    }

    if (id) {
        const index = pedidos.findIndex(p => p.id === pedido.id);
        pedidos[index] = pedido;
    } else {
        pedidos.unshift(pedido);
    }
    
    salvarPedidos();
    window.closeModal();
    renderListaDePedidos();
    showNotification('Pedido salvo com sucesso!', 'success');
};

window.handlePedidoDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
        pedidos = pedidos.filter(p => p.id !== id);
        salvarPedidos();
        window.closeModal();
        renderListaDePedidos();
        showNotification('Pedido excluído com sucesso!', 'success');
    }
};

window.renderPedidos = renderPedidos;
window.abrirModalDePedido = abrirModalDePedido;
