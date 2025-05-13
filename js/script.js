import { loadData, saveData, data } from './storage.js';
import { showSection, setupNav } from './ui.js';
import { refreshDashboard } from './dashboard.js';
import { renderClients } from './clients.js';
import { renderCases } from './cases.js';
import { renderDocuments } from './documents.js';
import { renderCalendar } from './calendar.js';

// Utility functions
export function $(selector) {
    return document.querySelector(selector);
}
export function $all(selector) {
    return document.querySelectorAll(selector);
}

// --- Setup on Load ---
window.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupNav();

    // Dashboard quick links event (delegated since section is dynamic)
    document.body.addEventListener('click', function(e) {
        // allow: only dashboard-quick-links a[data-section]
        let link = e.target;
        while (link && !(link.classList && link.classList.contains('dashboard-link-card'))) link = link.parentElement;
        if (link && link.dataset && link.dataset.section) {
            e.preventDefault();
            showSection(link.dataset.section);
            if (link.dataset.section === 'clients') renderClients();
            if (link.dataset.section === 'cases') renderCases();
            if (link.dataset.section === 'documents') renderDocuments();
            if (link.dataset.section === 'calendar') renderCalendar();
        }
    });

    // Initial: show dashboard and refresh
    showSection('dashboard');
    refreshDashboard();
});