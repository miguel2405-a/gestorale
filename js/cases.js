// cases.js
import { data, saveData } from './storage.js';
import { refreshDashboard } from './dashboard.js';
import { $, $all } from './script.js';

export function renderCases() {
    const section = $('#cases');
    // Get clients for select
    const clientOpts = data.clients.length
        ? data.clients.map(cl => `<option value="${cl.id}">${cl.nombre}</option>`).join('')
        : '<option disabled selected>No hay clientes</option>';
    section.innerHTML = `
        <h1><i class="bi bi-journal-bookmark-fill"></i> Gestión de Casos</h1>
        <form id="caseForm" class="row g-2 mb-3">
            <input type="hidden" id="caseId">
            <div class="col-md-4">
                <input type="text" class="form-control" id="caseTitulo" placeholder="Título del Caso" required>
            </div>
            <div class="col-md-3">
                <select class="form-select" id="caseCliente" required>
                    <option value="" disabled selected>Cliente</option>
                    ${clientOpts}
                </select>
            </div>
            <div class="col-md-3">
                <select class="form-select" id="caseStatus">
                    <option>Abierto</option>
                    <option>En Proceso</option>
                    <option>Finalizado</option>
                    <option>Archivado</option>
                </select>
            </div>
            <div class="col-md-2 d-grid">
                <button class="btn btn-primary" type="submit"><i class="bi bi-journal-plus"></i></button>
            </div>
        </form>
        <div class="table-responsive">
        <table class="table table-striped table-hover align-middle">
            <thead>
                <tr>
                    <th>Título</th>
                    <th>Cliente</th>
                    <th>Estado</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${data.cases.map(c => {
                    const cl = data.clients.find(cl => cl.id === c.cliente);
                    return `
                    <tr>
                        <td>${c.titulo}</td>
                        <td>${cl ? cl.nombre : '-'}</td>
                        <td>${c.status}</td>
                        <td>
                            <button class="btn btn-sm btn-secondary editCaseBtn" data-id="${c.id}"><i class="bi bi-pencil-square"></i></button>
                            <button class="btn btn-sm btn-danger deleteCaseBtn" data-id="${c.id}"><i class="bi bi-trash"></i></button>
                        </td>
                    </tr>`;
                }).join('')}
            </tbody>
        </table></div>
    `;

    section.querySelector('#caseForm').onsubmit = function(e) {
        e.preventDefault();
        const id = $('#caseId').value;
        const titulo = $('#caseTitulo').value.trim();
        const cliente = $('#caseCliente').value;
        const status = $('#caseStatus').value;
        if (!titulo || !cliente || !status) return;
        if (id) {
            // Edit
            const idx = data.cases.findIndex(c => c.id === id);
            if (idx >= 0) data.cases[idx] = { id, titulo, cliente, status };
        } else {
            // Add
            data.cases.push({ id: crypto.randomUUID(), titulo, cliente, status });
        }
        saveData();
        renderCases();
        refreshDashboard();
    };
    // Edit
    section.querySelectorAll('.editCaseBtn').forEach(btn => {
        btn.onclick = () => {
            const c = data.cases.find(c => c.id === btn.dataset.id);
            if (!c) return;
            $('#caseId').value = c.id;
            $('#caseTitulo').value = c.titulo;
            $('#caseCliente').value = c.cliente;
            $('#caseStatus').value = c.status;
        };
    });
    // Delete
    section.querySelectorAll('.deleteCaseBtn').forEach(btn => {
        btn.onclick = () => {
            if (confirm("¿Eliminar este caso?")) {
                data.cases = data.cases.filter(c => c.id !== btn.dataset.id);
                saveData();
                renderCases();
                refreshDashboard();
            }
        };
    });
}