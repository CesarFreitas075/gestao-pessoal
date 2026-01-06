// modules/financeiro.js

const FINANCEIRO_STORAGE_KEY = 'financeiro';
const FINANCEIRO_CATEGORIES_KEY = 'financeiro-categories'; // New key for categories
let transacoes = window.AppStorage.loadData(FINANCEIRO_STORAGE_KEY) || [];
let selectedDate = new Date();
let financeiroChartInstance = null;

// --- CATEGORY MANAGEMENT ---
function getFinanceiroCategorias() {
    let categorias = window.AppStorage.loadData(FINANCEIRO_CATEGORIES_KEY);
    if (!categorias || !Array.isArray(categorias) || categorias.length === 0) {
        categorias = ['Gasto Pessoal', 'Gasto Empresa', 'Empréstimo', 'Padrão', 'Alimentação', 'Transporte', 'Salário'];
        window.AppStorage.saveData(FINANCEIRO_CATEGORIES_KEY, categorias);
    }
    return categorias;
}

function getCategoryIcon(category) {
    switch (category) {
        case 'Gasto Pessoal':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-tag"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`;
        case 'Gasto Empresa':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-briefcase"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`;
        case 'Empréstimo':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-dollar-sign"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`;
        case 'Padrão':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-credit-card"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>`;
        case 'Alimentação':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-shopping-cart"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`;
        case 'Transporte':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-truck"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`;
        case 'Salário':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-dollar-sign"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`;
        default:
            return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-tag"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`;
    }
}


window.changeMonth = (offset) => {
    selectedDate.setMonth(selectedDate.getMonth() + offset);
    renderMonthSelector();
    renderResumoFinanceiro();
    renderFinanceiroChart();
    renderListaFinanceira();
}

// Seed dummy data if storage is empty
if (transacoes.length === 0) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    transacoes = [
        { id: Date.now() + 1, data: today.toISOString().slice(0, 10), descricao: 'Salário Mensal', valor: 5000, quantidade: 1, categoria: 'Padrão', tipoMovimento: 'entrada' },
        { id: Date.now() + 2, data: today.toISOString().slice(0, 10), descricao: 'Aluguel', valor: 1500, quantidade: 1, categoria: 'Gasto Pessoal', tipoMovimento: 'saida' },
        { id: Date.now() + 3, data: yesterday.toISOString().slice(0, 10), descricao: 'Almoço', valor: 35.50, quantidade: 1, categoria: 'Alimentação', tipoMovimento: 'saida' },
        { id: Date.now() + 4, data: yesterday.toISOString().slice(0, 10), descricao: 'Uber para reunião', valor: 22.00, quantidade: 1, categoria: 'Transporte', tipoMovimento: 'saida' },
    ];
    window.AppStorage.saveData(FINANCEIRO_STORAGE_KEY, transacoes);
}


function salvarTransacoes() {
    window.AppStorage.saveData(FINANCEIRO_STORAGE_KEY, transacoes);
}

function getFilteredTransactions() {
    return transacoes.filter(t => {
        const transacaoDate = new Date(t.data + 'T00:00:00-03:00');
        return transacaoDate.getMonth() === selectedDate.getMonth() &&
               transacaoDate.getFullYear() === selectedDate.getFullYear();
    });
}

function renderResumoFinanceiro() {
    const resumoEl = document.getElementById('financeiro-resumo');
    if (!resumoEl) return;

    const filteredTransacoes = getFilteredTransactions();
    const receitas = filteredTransacoes.filter(t => t.tipoMovimento === 'entrada').reduce((acc, t) => acc + (t.valor * t.quantidade), 0);
    const despesas = filteredTransacoes.filter(t => t.tipoMovimento === 'saida').reduce((acc, t) => acc + (t.valor * t.quantidade), 0);
    const saldo = receitas - despesas;

    const formatCurrency = (value) => `R$ ${value.toFixed(2).replace('.', ',')}`;

    resumoEl.innerHTML = `
        <div class="resumo-card">
            <div class="resumo-item">
                <span class="resumo-label">Receitas</span>
                <span class="resumo-valor" style="color: var(--ios-green);">${formatCurrency(receitas)}</span>
            </div>
            <div class="resumo-item">
                <span class="resumo-label">Despesas</span>
                <span class="resumo-valor" style="color: var(--ios-red);">${formatCurrency(despesas)}</span>
            </div>
            <div class="resumo-item">
                <span class="resumo-label">Saldo</span>
                <span class="resumo-valor">${formatCurrency(saldo)}</span>
            </div>
        </div>
    `;
}

function renderFinanceiroChart() {
    const ctx = document.getElementById('financeiro-chart');
    if (!ctx) return;

    const filteredTransacoes = getFilteredTransactions();
    const despesas = filteredTransacoes.filter(t => t.tipoMovimento === 'saida');

    const chartData = despesas.reduce((acc, t) => {
        const category = t.categoria || 'Sem Categoria';
        const value = t.valor * t.quantidade;
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += value;
        return acc;
    }, {});

    const labels = Object.keys(chartData);
    const data = Object.values(chartData);

    if (financeiroChartInstance) {
        financeiroChartInstance.destroy();
    }

    if (labels.length === 0) {
        document.getElementById('financeiro-chart-container').style.display = 'none';
        return;
    } else {
        document.getElementById('financeiro-chart-container').style.display = 'block';
    }

    financeiroChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Despesas por Categoria',
                data: data,
                backgroundColor: [
                    'rgba(255, 65, 108, 0.8)',
                    'rgba(142, 45, 226, 0.8)',
                    'rgba(0, 122, 255, 0.8)',
                    'rgba(255, 149, 0, 0.8)',
                    'rgba(52, 199, 89, 0.8)',
                    'rgba(88, 86, 214, 0.8)',
                    'rgba(255, 45, 85, 0.8)'
                ],
                borderColor: 'var(--color-content-background)',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 20,
                        padding: 20,
                        color: getComputedStyle(document.body).getPropertyValue('--color-text')
                    }
                }
            },
            cutout: '60%'
        }
    });
}

function renderMonthSelector() {
    const monthSelectorEl = document.getElementById('month-selector');
    if (!monthSelectorEl) return;

    const monthName = selectedDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
    monthSelectorEl.innerHTML = `
        <button class="month-nav-btn" onclick="changeMonth(-1)">&lt;</button>
        <span class="month-display">${monthName}</span>
        <button class="month-nav-btn" onclick="changeMonth(1)">&gt;</button>
    `;
}

function renderFinanceiro(container) {
    container.innerHTML = `
        <div class="module-header">
            <img src="${APP_LOGO_PATH}" alt="Gestão Pessoal" class="app-logo">
            <h1 class="visually-hidden">Financeiro</h1>
            <div class="header-actions">
                <button onclick="location.reload(true)" class="btn-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-refresh-cw"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                </button>
                <button onclick="abrirModalDeTransacao()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
            </div>
        </div>
        <div id="month-selector" class="month-selector-container"></div>
        <div id="financeiro-resumo" class="resumo-container"></div>
        <div id="financeiro-chart-container" class="chart-container">
            <canvas id="financeiro-chart"></canvas>
        </div>
        <ul id="lista-transacoes" class="wa-list"></ul>
    `;
    renderMonthSelector();
    renderResumoFinanceiro();
    renderFinanceiroChart();
    renderListaFinanceira();
}

function renderListaFinanceira() {
    const listaEl = document.getElementById('lista-transacoes');
    const filteredTransacoes = getFilteredTransactions();

    listaEl.innerHTML = '';
    if (filteredTransacoes.length === 0) {
        listaEl.innerHTML = '<li class="wa-list-item" style="opacity: 1; animation: none;"><div class="item-content"><span class="item-title">Nenhuma transação neste mês</span></div></li>';
        return;
    }

    const grouped = filteredTransacoes.reduce((acc, t) => {
        const category = t.categoria || 'Sem Categoria';
        if (!acc[category]) {
            acc[category] = { items: [], total: 0 };
        }
        acc[category].items.push(t);
        acc[category].total += t.tipoMovimento === 'entrada' ? (t.valor * t.quantidade) : -(t.valor * t.quantidade);
        return acc;
    }, {});

    const sortedCategories = Object.keys(grouped).sort();
    let itemAnimationDelay = 0;

    sortedCategories.forEach(category => {
        const group = grouped[category];
        const categoryLi = document.createElement('li');
        categoryLi.className = 'category-group';

        const groupHeader = document.createElement('div');
        groupHeader.className = 'category-header';
        const formatCurrency = (value) => `R$ ${value.toFixed(2).replace('.', ',')}`;
        groupHeader.innerHTML = `<h3>${category}</h3><span class="category-total">${formatCurrency(group.total)}</span>`;
        categoryLi.appendChild(groupHeader);

        const categoryTransactionsUl = document.createElement('ul');
        categoryTransactionsUl.className = 'wa-list wa-list-nested';
        
        group.items.sort((a, b) => new Date(b.data) - new Date(a.data)).forEach(t => {
            const item = document.createElement('li');
            item.className = 'wa-list-item';
            item.onclick = () => abrirModalDeTransacao(t);
            item.style.animationDelay = `${itemAnimationDelay * 0.05}s`;
            itemAnimationDelay++;
            
            const valorTotal = t.valor * t.quantidade;
            const valorFormatado = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
            const dataFormatada = new Date(t.data + 'T00:00:00-03:00').toLocaleDateString('pt-BR');

            item.innerHTML = `
                <div class="item-icon">${getCategoryIcon(t.categoria)}</div>
                <div class="item-content">
                    <span class="item-title">${t.descricao}</span>
                    <span class="item-subtitle">${dataFormatada}</span>
                </div>
                <div class="item-right">
                    <span class="value" style="color: ${t.tipoMovimento === 'saida' ? 'var(--ios-red)' : 'var(--ios-green)'}; font-weight: 500;">
                        ${t.tipoMovimento === 'saida' ? '-' : ''}${valorFormatado}
                    </span>
                </div>`;
            categoryTransactionsUl.appendChild(item);
        });

        categoryLi.appendChild(categoryTransactionsUl);
        listaEl.appendChild(categoryLi);
    });
}

function abrirModalDeTransacao(transacaoParaEditar = null) {
    const modal = document.getElementById('app-modal');
    document.getElementById('modal-title').textContent = transacaoParaEditar ? 'Editar Transação' : 'Nova Transação';
    
    const categorias = getFinanceiroCategorias();
    const categoryChipsHTML = categorias.map(cat => {
        const isChecked = transacaoParaEditar?.categoria === cat ? 'checked' : '';
        return `<label><input type="radio" name="transacao-categoria" value="${cat}" ${isChecked} required><span>${cat}</span></label>`;
    }).join('');

    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <form id="form-transacao" onsubmit="event.preventDefault(); handleFinanceiroSubmit();">
            <input type="hidden" id="transacao-id" value="${transacaoParaEditar?.id || ''}">
            
            <div class="form-section">
                <div class="form-group">
                    <div class="segmented-control">
                        <input type="radio" id="tipo-saida" name="transacao-tipo-movimento" value="saida" ${transacaoParaEditar?.tipoMovimento !== 'entrada' ? 'checked' : ''}>
                        <label for="tipo-saida">Saída</label>
                        <input type="radio" id="tipo-entrada" name="transacao-tipo-movimento" value="entrada" ${transacaoParaEditar?.tipoMovimento === 'entrada' ? 'checked' : ''}>
                        <label for="tipo-entrada">Entrada</label>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <div class="form-group"><label>Descrição</label><input type="text" id="transacao-descricao" required value="${transacaoParaEditar?.descricao || ''}"></div>
                <div class="form-group"><label>Valor</label><input type="number" id="transacao-valor" step="0.01" required placeholder="0,00" value="${transacaoParaEditar?.valor || ''}"></div>
                <div class="form-group"><label>Quantidade</label><input type="number" id="transacao-quantidade" min="1" step="1" required value="${transacaoParaEditar?.quantidade || 1}"></div>
                <div class="form-group"><label>Data</label><input type="date" id="transacao-data" required value="${transacaoParaEditar?.data || new Date().toISOString().slice(0, 10)}"></div>
            </div>
            
            <div class="form-section">
                <div class="form-group"><label>Categoria</label></div>
                <div class="category-chips">
                    ${categoryChipsHTML}
                </div>
            </div>
            
            <button type="submit" class="btn">${transacaoParaEditar ? 'Salvar Alterações' : 'Adicionar Transação'}</button>
            ${transacaoParaEditar ? `<button type="button" onclick="handleFinanceiroDelete(${transacaoParaEditar.id})" class="btn btn-danger" style="margin-top: 10px;">Excluir Transação</button>` : ''}
        </form>
    `;
    modal.classList.remove('hidden');

    const closeModalBtn = document.getElementById('modal-close-btn');
    closeModalBtn.onclick = window.closeModal;
    modal.onclick = (e) => { if (e.target === modal) window.closeModal(); };
}

window.closeModal = () => {
    document.getElementById('app-modal').classList.add('hidden');
    document.getElementById('modal-body').innerHTML = '';
}

window.handleFinanceiroSubmit = () => {
    const form = document.getElementById('form-transacao');
    const id = form.querySelector('#transacao-id').value;
    const categoria = form.querySelector('input[name="transacao-categoria"]:checked');
    if (!categoria) {
        showNotification('Selecione uma categoria.', 'error');
        return;
    }

    const transacao = {
        id: id ? parseInt(id) : Date.now(),
        data: form.querySelector('#transacao-data').value,
        descricao: form.querySelector('#transacao-descricao').value.trim(),
        valor: parseFloat(form.querySelector('#transacao-valor').value),
        quantidade: parseInt(form.querySelector('#transacao-quantidade').value),
        categoria: categoria.value,
        tipoMovimento: form.querySelector('input[name="transacao-tipo-movimento"]:checked').value,
    };

    if (!transacao.descricao || isNaN(transacao.valor) || transacao.valor <= 0 || isNaN(transacao.quantidade) || transacao.quantidade <= 0) {
        showNotification('Preencha os campos corretamente.', 'error');
        return;
    }

    const index = transacoes.findIndex(t => t.id === transacao.id);
    if (index > -1) {
        transacoes[index] = transacao;
    } else {
        transacoes.unshift(transacao);
    }
    
    salvarTransacoes();
    closeModal();
    renderResumoFinanceiro();
    renderFinanceiroChart();
    renderListaFinanceira();
    showNotification('Transação salva com sucesso!', 'success');
};

window.handleFinanceiroDelete = (id) => {
    if (confirm('Tem certeza?')) {
        transacoes = transacoes.filter(t => t.id !== id);
        salvarTransacoes();
        closeModal();
        renderResumoFinanceiro();
        renderFinanceiroChart();
        renderListaFinanceira();
        showNotification('Transação excluída com sucesso!', 'success');
    }
};

window.renderFinanceiro = renderFinanceiro;
window.abrirModalDeTransacao = abrirModalDeTransacao;
window.getFinanceiroCategorias = getFinanceiroCategorias; // Expose for settings