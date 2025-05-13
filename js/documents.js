// documents.js
import { data, saveData } from './storage.js';
import { $, $all } from './script.js';

export function renderDocuments() {
    const section = $('#documents');
    const caseOpts = data.cases.length
        ? data.cases.map(cs => `<option value="${cs.id}">${cs.titulo}</option>`).join('')
        : '<option disabled selected>No hay casos</option>';
    section.innerHTML = `
        <h1><i class="bi bi-file-earmark-text-fill"></i> Gestión de Documentos</h1>
        <form id="docForm" class="row g-2 mb-3">
            <input type="hidden" id="docId">
            <div class="col-md-4">
                <input type="text" class="form-control" id="docNombre" placeholder="Nombre del Documento" required>
            </div>
            <div class="col-md-4">
                <select class="form-select" id="docCaso" required>
                    <option value="" disabled selected>Caso Asociado</option>
                    ${caseOpts}
                </select>
            </div>
            <div class="col-md-3">
                <input type="text" class="form-control" id="docTipo" placeholder="Tipo (contrato, demanda...)">
            </div>
            <div class="col-md-1 d-grid">
                <button class="btn btn-primary" type="submit"><i class="bi bi-plus-circle-fill"></i></button>
            </div>
        </form>
        <div class="table-responsive">
        <table class="table table-striped table-hover align-middle">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Caso</th>
                    <th>Tipo</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${data.documents.map(d => {
                    const cs = data.cases.find(cs => cs.id === d.caso);
                    return `
                    <tr>
                        <td>${d.nombre}</td>
                        <td>${cs ? cs.titulo : '-'}</td>
                        <td>${d.tipo || ''}</td>
                        <td>
                            <button class="btn btn-sm btn-danger deleteDocBtn" data-id="${d.id}"><i class="bi bi-trash"></i></button>
                        </td>
                    </tr>`;
                }).join('')}
            </tbody>
        </table></div>
        <small class="text-muted">La subida real de archivos estará disponible próximamente.</small>
    `;
    // Handler
    section.querySelector('#docForm').onsubmit = function(e) {
        e.preventDefault();
        const id = $('#docId').value;
        const nombre = $('#docNombre').value.trim();
        const caso = $('#docCaso').value;
        const tipo = $('#docTipo').value.trim();
        if (!nombre || !caso) return;
        if (id) {
            // Edit not available for docs
        } else {
            data.documents.push({ id: crypto.randomUUID(), nombre, caso, tipo });
        }
        saveData();
        renderDocuments();
    };
    // Delete
    section.querySelectorAll('.deleteDocBtn').forEach(btn => {
        btn.onclick = () => {
            if (confirm("¿Eliminar este documento?")) {
                data.documents = data.documents.filter(d => d.id !== btn.dataset.id);
                saveData();
                renderDocuments();
            }
        };
    });
}

