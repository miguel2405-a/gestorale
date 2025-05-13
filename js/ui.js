// ui.js
import { renderClients } from './clients.js';
import { renderCases } from './cases.js';
import { renderDocuments } from './documents.js';
import { renderCalendar } from './calendar.js';
import { refreshDashboard } from './dashboard.js';
import { $, $all } from './script.js';

export function showSection(sectionId) {
    $all('.content-section').forEach(sec => sec.style.display = 'none');
    $('#' + sectionId).style.display = 'block';
    $all('.nav-link').forEach(link => link.classList.remove('active'));
    $all('.nav-link[data-section]').forEach(link => {
        if (link.dataset.section === sectionId) link.classList.add('active');
    });
}

export function setupNav() {
    $all('.nav-link[data-section]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            showSection(link.dataset.section);
            if (link.dataset.section === 'clients') renderClients();
            if (link.dataset.section === 'cases') renderCases();
            if (link.dataset.section === 'documents') renderDocuments();
            if (link.dataset.section === 'calendar') renderCalendar();
            if (link.dataset.section === 'dashboard') refreshDashboard();
        });
    });
}