// clients.js
import { data, saveData } from './storage.js';
import { refreshDashboard } from './dashboard.js';
import { $, $all } from './script.js';

export function renderClients() {
    const section = $('#clients');
    section.innerHTML = `
        <h1><i class="bi bi-people-fill"></i> Gestión de Clientes</h1>
        <form id="clientForm" class="row g-2 mb-3">
            <input type="hidden" id="clientId">
            <div class="col-md-4">
                <input type="text" class="form-control" id="clientNombre" placeholder="Nombre" required>
            </div>
            <div class="col-md-4">
                <input type="email" class="form-control" id="clientEmail" placeholder="Email" required>
            </div>
            <div class="col-md-3">
                <input type="tel" class="form-control" id="clientTelefono" placeholder="Teléfono">
            </div>
            <div class="col-md-1 d-grid">
                <button class="btn btn-primary" type="submit"><i class="bi bi-person-plus-fill"></i></button>
            </div>
        </form>
        <div class="table-responsive">
        <table class="table table-striped table-hover align-middle">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${data.clients.map(c => `
                    <tr>
                        <td>${c.nombre}</td>
                        <td>${c.email}</td>
                        <td>${c.telefono || ''}</td>
                        <td>
                            <button class="btn btn-sm btn-secondary editClientBtn" data-id="${c.id}"><i class="bi bi-pencil-square"></i></button>
                            <button class="btn btn-sm btn-danger deleteClientBtn" data-id="${c.id}"><i class="bi bi-trash"></i></button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table></div>
    `;

    // Form handler
    section.querySelector('#clientForm').onsubmit = function(e) {
        e.preventDefault();
        const id = $('#clientId').value;
        const nombre = $('#clientNombre').value.trim();
        const email = $('#clientEmail').value.trim();
        const telefono = $('#clientTelefono').value.trim();
        if (!nombre || !email) return;

        if (id) {
            // Edit
            const idx = data.clients.findIndex(c => c.id === id);
            if (idx >= 0) {
                data.clients[idx] = { id, nombre, email, telefono };
            }
        } else {
            // Add
            data.clients.push({
                id: crypto.randomUUID(),
                nombre, email, telefono
            });
        }
        saveData();
        renderClients();
        refreshDashboard();
    };

    // Edit
    section.querySelectorAll('.editClientBtn').forEach(btn => {
        btn.onclick = () => {
            const c = data.clients.find(c => c.id === btn.dataset.id);
            if (!c) return;
            $('#clientId').value = c.id;
            $('#clientNombre').value = c.nombre;
            $('#clientEmail').value = c.email;
            $('#clientTelefono').value = c.telefono;
        };
    });
    // Delete
    section.querySelectorAll('.deleteClientBtn').forEach(btn => {
        btn.onclick = () => {
            if (confirm("¿Eliminar este cliente?")) {
                data.clients = data.clients.filter(c => c.id !== btn.dataset.id);
                saveData();
                renderClients();
                refreshDashboard();
            }
        };
    });
}