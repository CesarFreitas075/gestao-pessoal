// modules/notifications.js

/**
 * Cria e exibe uma notificação toast na tela.
 * @param {string} message - A mensagem a ser exibida.
 * @param {string} type - O tipo de notificação ('success', 'error', 'info'). Define a cor.
 * @param {number} duration - Duração em milissegundos antes da notificação desaparecer.
 */
function showNotification(message, type = 'info', duration = 3000) {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `toast toast--${type}`;
    notification.textContent = message;

    container.appendChild(notification);

    // Forçar a animação de entrada
    setTimeout(() => {
        notification.classList.add('toast--visible');
    }, 10);

    // Remover a notificação após a duração
    setTimeout(() => {
        notification.classList.remove('toast--visible');
        // Remover do DOM após a animação de saída
        notification.addEventListener('transitionend', () => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        });
    }, duration);
}

// Expor a função globalmente
window.showNotification = showNotification;
