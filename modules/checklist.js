// modules/checklist.js

function renderChecklist(container) {
    container.innerHTML = `
        <div class="module-header">
            <h1>Checklist</h1>
            <div class="header-actions">
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                        <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="construction-placeholder">
            <h2>Em Construção</h2>
            <p>O checklist fotográfico estará disponível em breve.</p>
        </div>
    `;
}

window.renderChecklist = renderChecklist;