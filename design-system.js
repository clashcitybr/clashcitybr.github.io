/* ============================================================
   CLASH CITY BR — DESIGN SYSTEM (JS)
   ------------------------------------------------------------
   Utilitário compartilhado de toast (feedback discreto). Carregar
   depois de design-system.css. Uso:

     ccToast('Dados atualizados ✓');
     ccToast('Chave de admin incorreta', 'error');
   ============================================================ */

function ccToast(mensagem, tipo) {
    let container = document.getElementById('cc-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'cc-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'cc-toast' + (tipo === 'error' ? ' cc-toast-error' : tipo === 'success' ? ' cc-toast-success' : '');
    toast.textContent = mensagem;
    container.appendChild(toast);

    // Força um reflow antes de adicionar a classe que anima a entrada
    requestAnimationFrame(() => toast.classList.add('cc-toast-show'));

    setTimeout(() => {
        toast.classList.remove('cc-toast-show');
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}