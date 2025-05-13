// calendar.js
import { data, saveData } from './storage.js';
import { $, $all } from './script.js';

function buildMiniCalendar(events, year, month) {
    const today = new Date();
    const selectedYear = year ?? today.getFullYear();
    const selectedMonth = month ?? today.getMonth();
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay(); // 0=Dom
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    const dayEvents = {};
    events.forEach(ev => {
        const d = new Date(ev.fecha);
        if (d.getFullYear() === selectedYear && d.getMonth() === selectedMonth) {
            const day = d.getDate();
            if (!dayEvents[day]) dayEvents[day] = [];
            dayEvents[day].push(ev);
        }
    });

    let cal = `
    <div class="d-flex justify-content-between align-items-center mb-2">
        <button class="btn btn-sm btn-light border" id="calPrevBtn"><i class="bi bi-chevron-left"></i></button>
        <strong>${new Date(selectedYear, selectedMonth).toLocaleString('es-ES',{month:'long',year:'numeric'})}</strong>
        <button class="btn btn-sm btn-light border" id="calNextBtn"><i class="bi bi-chevron-right"></i></button>
    </div>
    <div class="table-responsive mb-2">
    <table class="table table-sm table-bordered text-center mb-0" style="min-width:290px;background:#fcfcfc">
        <thead class="bg-light">
            <tr>
                <th>D</th><th>L</th><th>M</th><th>M</th><th>J</th><th>V</th><th>S</th>
            </tr>
        </thead>
        <tbody>
    `;
    let currDay = 1;
    let started = false;
    for(let wk=0; wk<6; wk++) {
        cal += '<tr>';
        for(let wd=0; wd<7; wd++) {
            if(!started && wd === firstDay) started = true;
            if(!started || currDay > daysInMonth) {
                cal += `<td style="background:#f6f6f6"></td>`;
            } else {
                const eventMarkers = (dayEvents[currDay]||[]).length ? 
                    `<span class="badge rounded-pill bg-primary" 
                     style="font-size:0.6em;">${dayEvents[currDay].length}</span>` : '';
                const isToday = (currDay === today.getDate() && 
                                 selectedMonth === today.getMonth() && 
                                 selectedYear === today.getFullYear());
                cal += `<td style="cursor:pointer;${isToday?'background:#e0f0ff;':''}" 
                            data-calday="${currDay}">
                            <div>${currDay}</div>
                            ${eventMarkers}
                        </td>`;
                currDay++;
            }
        }
        cal += '</tr>';
        if(currDay > daysInMonth) break;
    }
    cal += '</tbody></table></div>';
    cal += `<div id="miniDayDetail"></div>`;
    return cal;
}

export function renderCalendar() {
    const section = $('#calendar');
    const crudContainer = document.getElementById('calendarCrudContainer');
    const fullView = document.getElementById('calendarFullView');
    const calendarViewLabel = document.getElementById('calendarViewLabel');

    // Render CRUD section
    crudContainer.innerHTML = `
        <form id="calendarForm" class="row g-2 mb-3">
            <input type="hidden" id="eventId">
            <div class="col-md-3">
                <input type="date" class="form-control" id="eventFecha" required>
            </div>
            <div class="col-md-5">
                <input type="text" class="form-control" id="eventTitulo" placeholder="Título del Evento" required>
            </div>
            <div class="col-md-3">
                <input type="text" class="form-control" id="eventDescripcion" placeholder="Descripción">
            </div>
            <div class="col-md-1 d-grid">
                <button class="btn btn-primary" type="submit"><i class="bi bi-calendar-plus"></i></button>
            </div>
        </form>
        <div class="table-responsive">
        <table class="table table-striped table-hover align-middle">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Título</th>
                    <th>Descripción</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${data.calendar.map(ev => `
                    <tr>
                        <td>${ev.fecha}</td>
                        <td>${ev.titulo}</td>
                        <td>${ev.descripcion}</td>
                        <td>
                            <button class="btn btn-sm btn-secondary editEventBtn" data-id="${ev.id}"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-sm btn-danger deleteEventBtn" data-id="${ev.id}"><i class="bi bi-trash"></i></button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table></div>
        <small class="text-muted">Registra tus citas, audiencias y vencimientos. Haz clic en <i class="bi bi-calendar3"></i> para ver el calendario.</small>
    `;
    // Form handler
    crudContainer.querySelector('#calendarForm').onsubmit = function(e) {
        e.preventDefault();
        const id = $('#eventId').value;
        const fecha = $('#eventFecha').value;
        const titulo = $('#eventTitulo').value.trim();
        const descripcion = $('#eventDescripcion').value.trim();
        if (!fecha || !titulo) return;
        if (id) {
            // Edit
            const idx = data.calendar.findIndex(ev => ev.id === id);
            if (idx >= 0) data.calendar[idx] = { id, fecha, titulo, descripcion };
        } else {
            // Add
            data.calendar.push({ id: crypto.randomUUID(), fecha, titulo, descripcion });
        }
        saveData();
        renderCalendar();
    };
    // Edit
    crudContainer.querySelectorAll('.editEventBtn').forEach(btn => {
        btn.onclick = () => {
            const ev = data.calendar.find(ev => ev.id === btn.dataset.id);
            if (!ev) return;
            $('#eventId').value = ev.id;
            $('#eventFecha').value = ev.fecha;
            $('#eventTitulo').value = ev.titulo;
            $('#eventDescripcion').value = ev.descripcion;
            $('#calendarForm').scrollIntoView({behavior: 'smooth', block: 'center'});
        };
    });
    // Delete
    crudContainer.querySelectorAll('.deleteEventBtn').forEach(btn => {
        btn.onclick = () => {
            if (confirm("¿Eliminar este evento?")) {
                data.calendar = data.calendar.filter(ev => ev.id !== btn.dataset.id);
                saveData();
                renderCalendar();
            }
        };
    });

    // --- Mini calendario visual ---
    if (!window._calView) {
        const now = new Date();
        window._calView = { y: now.getFullYear(), m: now.getMonth() };
    }
    function updateMiniCalendar(year, month) {
        fullView.innerHTML = buildMiniCalendar(data.calendar, year, month);
        calendarViewLabel.textContent = "Viendo: " + new Date(year, month).toLocaleString('es-ES',{month:'long',year:'numeric'});
        const prevBtn = fullView.querySelector('#calPrevBtn');
        const nextBtn = fullView.querySelector('#calNextBtn');
        prevBtn.onclick = () => {
            if (window._calView.m === 0) {
                window._calView.y -= 1;
                window._calView.m = 11;
            } else window._calView.m -= 1;
            updateMiniCalendar(window._calView.y, window._calView.m);
        };
        nextBtn.onclick = () => {
            if (window._calView.m === 11) {
                window._calView.y += 1;
                window._calView.m = 0;
            } else window._calView.m += 1;
            updateMiniCalendar(window._calView.y, window._calView.m);
        };
        fullView.querySelectorAll('td[data-calday]').forEach(td => {
            td.onclick = () => {
                const selDay = td.getAttribute('data-calday');
                const evts = data.calendar.filter(ev=>{
                    const d = new Date(ev.fecha);
                    return d.getFullYear()===year && d.getMonth()===month && d.getDate()==selDay;
                });
                const detailDiv = fullView.querySelector('#miniDayDetail');
                if (evts.length) {
                    detailDiv.innerHTML = `
                    <div class="card card-body mt-2">
                    <strong>${selDay} de ${new Date(year,month).toLocaleString('es-ES',{month:'long'})}:</strong>
                    <ul style="padding-left:1em">
                        ${evts.map(e=>`<li><b>${e.titulo}</b>${e.descripcion?', '+e.descripcion:''}</li>`).join('')}
                    </ul>
                    </div>`;
                } else {
                    detailDiv.innerHTML = '';
                }
            };
        });
    }

    // Mostrar/ocultar calendario visual
    const btn = document.getElementById('toggleCalendarViewBtn');
    if (btn) {
        btn.onclick = () => {
            if (fullView.style.display === "none") {
                fullView.style.display = '';
                crudContainer.style.display = 'none';
                updateMiniCalendar(window._calView.y, window._calView.m);
                btn.innerHTML = `<i class="bi bi-list-ul"></i> Ver Lista`;
                btn.title = "Ver agenda como lista";
                calendarViewLabel.style.display = '';
            } else {
                fullView.style.display = 'none';
                crudContainer.style.display = '';
                btn.innerHTML = `<i class="bi bi-calendar3"></i> Ver Calendario`;
                btn.title = "Ver calendario";
                calendarViewLabel.textContent = '';
                calendarViewLabel.style.display = 'none';
            }
        };
        fullView.style.display = 'none';
        crudContainer.style.display = '';
        btn.innerHTML = `<i class="bi bi-calendar3"></i> Ver Calendario`;
        btn.title = "Ver calendario";
        calendarViewLabel.textContent = '';
        calendarViewLabel.style.display = 'none';
    }
}