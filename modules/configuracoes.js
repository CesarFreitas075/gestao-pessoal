// modules/configuracoes.js

const THEME_STORAGE_KEY = 'app-theme';
const FINANCEIRO_CATEGORIES_KEY = 'financeiro-categories';

function renderConfiguracoes(container) {
    const currentTheme = window.AppStorage.loadData(THEME_STORAGE_KEY) || 'light';
    const categorias = window.getFinanceiroCategorias ? window.getFinanceiroCategorias() : [];

    const categoriesHTML = categorias.map(cat => `
        <li class="wa-list-item category-manage-item">
            <div class="item-content">
                <span class="item-title">${cat}</span>
            </div>
            <div class="item-right">
                <button class="btn-delete-category" data-category="${cat}">&times;</button>
            </div>
        </li>
    `).join('');

    container.innerHTML = `
        <div class="module-header">
            <img src="${APP_LOGO_PATH}" alt="Gestão Pessoal" class="app-logo">
            <h1 class="visually-hidden">Ajustes</h1>
        </div>

        <div class="settings-section-header">
            <h3>Aparência</h3>
        </div>
        <ul class="wa-list">
            <li class="wa-list-item">
                <div class="item-content">
                    <span class="item-title">Modo Escuro</span>
                </div>
                <div class="item-right">
                    <label class="switch">
                        <input type="checkbox" id="theme-toggle" ${currentTheme === 'dark' ? 'checked' : ''}>
                        <span class="slider round"></span>
                    </label>
                </div>
            </li>
        </ul>
        
        <div class="settings-section-header">
            <h3>Categorias de Finanças</h3>
        </div>
        <ul class="wa-list" id="category-list">
            ${categoriesHTML}
        </ul>
        <div class="add-category-form">
            <input type="text" id="new-category-name" placeholder="Nova categoria...">
            <button id="add-category-btn" class="btn">+</button>
        </div>


        <div class="settings-section-header">
            <h3>Gestão de Dados</h3>
        </div>
        <ul class="wa-list">
            <li class="wa-list-item" id="export-data-btn">
                <div class="item-content"><span class="item-title">Exportar Todos os Dados</span></div>
                <div class="item-right"><span>></span></div>
            </li>
            <li class="wa-list-item" id="clear-data-btn">
                <div class="item-content"><span class="item-title" style="color: var(--ios-red);">Limpar Todos os Dados</span></div>
                <div class="item-right"><span>></span></div>
            </li>
        </ul>
        
        <div class="settings-section-header">
            <h3>App</h3>
        </div>
        <ul class="wa-list">
             <li class="wa-list-item" onclick="location.reload(true)">
                <div class="item-content"><span class="item-title">Forçar Atualização</span></div>
                <div class="item-right"><span>></span></div>
            </li>
        </ul>
    `;

    setupConfiguracoesListeners();
}

function setupConfiguracoesListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) themeToggle.addEventListener('change', handleThemeToggle);

    // Data management
    const exportBtn = document.getElementById('export-data-btn');
    if (exportBtn) exportBtn.addEventListener('click', exportAllData);
    const clearBtn = document.getElementById('clear-data-btn');
    if (clearBtn) clearBtn.addEventListener('click', clearAllData);
    
    // Category management
    const addCategoryBtn = document.getElementById('add-category-btn');
    if (addCategoryBtn) addCategoryBtn.addEventListener('click', handleAddCategory);
    
    document.querySelectorAll('.btn-delete-category').forEach(btn => {
        btn.addEventListener('click', handleDeleteCategory);
    });
}

function handleAddCategory() {
    const input = document.getElementById('new-category-name');
    const newCategoryName = input.value.trim();
    if (!newCategoryName) {
        alert('Por favor, insira um nome para a categoria.');
        return;
    }

    let categorias = window.getFinanceiroCategorias();
    if (categorias.find(c => c.toLowerCase() === newCategoryName.toLowerCase())) {
        alert('Esta categoria já existe.');
        return;
    }

    categorias.push(newCategoryName);
    window.AppStorage.saveData(FINANCEIRO_CATEGORIES_KEY, categorias);
    
    renderModule('configuracoes');
}

function handleDeleteCategory(event) {
    const categoryToDelete = event.target.dataset.category;
    if (!categoryToDelete) return;
    
    if (confirm(`Tem certeza que deseja excluir a categoria "${categoryToDelete}"?`)) {
        let categorias = window.getFinanceiroCategorias();
        categorias = categorias.filter(cat => cat !== categoryToDelete);
        window.AppStorage.saveData(FINANCEIRO_CATEGORIES_KEY, categorias);
        
        renderModule('configuracoes');
    }
}

function handleThemeToggle(event) {
    const theme = event.target.checked ? 'dark' : 'light';
    document.body.className = theme + '-mode';
    window.AppStorage.saveData(THEME_STORAGE_KEY, theme);
}

function exportAllData() {
    const data = {};
    const keysToExport = Object.keys(localStorage).filter(key => key.startsWith('gestao-pessoal-'));
    
    keysToExport.forEach(key => {
        data[key] = JSON.parse(localStorage.getItem(key));
    });

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gestao-pessoal-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Dados exportados com sucesso!');
}

function clearAllData() {
    if (confirm('ATENÇÃO: Esta ação é irreversível e irá apagar TODOS os dados do aplicativo (finanças, tarefas, etc.). Deseja continuar?')) {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).startsWith('gestao-pessoal-')) {
                keysToRemove.push(localStorage.key(i));
            }
        }
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
        });
        
        localStorage.removeItem(THEME_STORAGE_KEY);

        alert('Todos os dados foram apagados.');
        location.reload();
    }
}

function applyInitialTheme() {
    const savedTheme = window.AppStorage.loadData(THEME_STORAGE_KEY);
    if (savedTheme === 'dark') {
        document.body.className = 'dark-mode';
    } else {
        document.body.className = 'light-mode';
    }
}

applyInitialTheme();

window.renderConfiguracoes = renderConfiguracoes;