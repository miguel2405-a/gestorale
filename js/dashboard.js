// dashboard.js
import { data } from './storage.js';
import { $ } from './script.js';

export function refreshDashboard() {
    // Show main counts
    const clientsCount = data.clients.length;
    const openCasesCount = data.cases.filter(c => ["Abierto", "En Proceso"].includes(c.status)).length;
    $('#dashboardClientsCount').textContent = clientsCount;
    $('#dashboardOpenCasesCount').textContent = openCasesCount;
}