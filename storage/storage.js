// storage/storage.js

/**
 * Módulo central para interagir com o LocalStorage.
 * Todas as operações de leitura e escrita devem passar por aqui.
 */

// Chaves usadas no LocalStorage para garantir consistência.
const STORAGE_KEYS = {
    financeiro: 'gestao-pessoal-financeiro',
    tarefas: 'gestao-pessoal-tarefas',
    anotacoes: 'gestao-pessoal-anotacoes',
};

/**
 * Salva dados no LocalStorage.
 * @param {string} key - A chave onde os dados serão salvos (ex: 'financeiro').
 * @param {any} data - O dado a ser salvo. Será convertido para JSON.
 */
function saveData(key, data) {
    if (!STORAGE_KEYS[key]) {
        console.error(`Chave de armazenamento inválida: ${key}`);
        return;
    }
    try {
        const jsonData = JSON.stringify(data);
        localStorage.setItem(STORAGE_KEYS[key], jsonData);
    } catch (error) {
        console.error(`Erro ao salvar dados para a chave ${key}:`, error);
    }
}

/**
 * Lê dados do LocalStorage.
 * @param {string} key - A chave da qual os dados serão lidos (ex: 'financeiro').
 * @returns {any} O dado desserializado ou null se não houver nada ou em caso de erro.
 */
function loadData(key) {
    if (!STORAGE_KEYS[key]) {
        console.error(`Chave de armazenamento inválida: ${key}`);
        return null;
    }
    try {
        const jsonData = localStorage.getItem(STORAGE_KEYS[key]);
        return jsonData ? JSON.parse(jsonData) : null;
    } catch (error) {
        console.error(`Erro ao carregar dados da chave ${key}:`, error);
        return null;
    }
}

/**
 * Remove dados do LocalStorage.
 * @param {string} key - A chave a ser removida (ex: 'financeiro').
 */
function removeData(key) {
    if (!STORAGE_KEYS[key]) {
        console.error(`Chave de armazenamento inválida: ${key}`);
        return;
    }
    localStorage.removeItem(STORAGE_KEYS[key]);
}

// Exporta as funções para serem usadas em outros módulos.
// Usando um objeto para evitar conflito de nomes e facilitar a importação.
const Storage = {
    saveData,
    loadData,
    removeData,
};

// Para permitir a importação em outros arquivos, vamos anexar ao objeto window.
// Esta é uma abordagem simples para modularidade sem um sistema de build.
window.AppStorage = Storage;
