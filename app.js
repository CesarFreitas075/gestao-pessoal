// app.js

/**
 * Ponto de entrada principal e roteador do aplicativo.
 * Gerencia a navegação da Tab Bar e o carregamento de módulos.
 */

// Módulos principais que aparecerão na Tab Bar
window.APP_LOGO_PATH = 'icons/apple-touch-icon.png';

const TABS = [
    { name: 'financeiro', label: 'Financeiro', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trending-up"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>` },
    { name: 'tarefas', label: 'Tarefas', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-square"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>` },
    { name: 'anotacoes', label: 'Anotações', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>` },
    { name: 'pedidos', label: 'Pedidos', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-package"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>` },
    { name: 'agenda_telefonica', label: 'Agenda', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-book"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>` },
    { name: 'configuracoes', label: 'Ajustes', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-settings"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>` }
];

let currentModule = '';

// Carrega todos os módulos antes de iniciar o app
(async () => {
    const modulesToLoad = [
        'storage/storage.js',
        'modules/notifications.js',
        'modules/financeiro.js',
        'modules/tarefas.js',
        'modules/anotacoes.js',
        'modules/agenda.js',
        'modules/pedidos.js',
        'modules/configuracoes.js',
        'modules/checklist.js',
        'modules/agenda_telefonica.js'
    ];

    for (const modulePath of modulesToLoad) {
        try {
            await import(`./${modulePath}?v=${new Date().getTime()}`);
        } catch (error) {
            console.error(`Falha ao carregar o módulo: ${modulePath}`, error);
        }
    }
    
    initializeApp();
})();

function initializeApp() {
    renderTabBar();
    // Define o módulo inicial a ser exibido
    renderModule('financeiro'); 
}

function renderTabBar() {
    const tabBar = document.getElementById('tab-bar');
    tabBar.innerHTML = '';

    TABS.forEach(tab => {
        const button = document.createElement('button');
        button.className = 'tab-button';
        button.dataset.module = tab.name;
        button.innerHTML = `
            ${tab.icon}
            <span>${tab.label}</span>
        `;
        button.addEventListener('click', () => renderModule(tab.name));
        tabBar.appendChild(button);
    });
}

function updateActiveTab() {
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => {
        if (button.dataset.module === currentModule) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function renderModule(moduleName) {
    // Evita re-renderizar o mesmo módulo
    if (currentModule === moduleName && document.getElementById('app-content').innerHTML !== '') return;

    currentModule = moduleName;
    const appContent = document.getElementById('app-content');
    appContent.innerHTML = ''; // Limpa o conteúdo

    const renderFunctions = {
        financeiro: window.renderFinanceiro,
        tarefas: window.renderTarefas,
        anotacoes: window.renderAnotacoes,
        pedidos: window.renderPedidos,
        configuracoes: window.renderConfiguracoes,
        agenda: window.renderAgenda,
        checklist: window.renderChecklist,
        agenda_telefonica: window.renderAgendaTelefonica
    };

    const renderFn = renderFunctions[moduleName];
    if (renderFn) {
        renderFn(appContent);
    } else {
        appContent.innerHTML = `<div class="construction-placeholder">Módulo não encontrado.</div>`;
    }

    updateActiveTab();
}
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js');
  });
}

