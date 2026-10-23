/**
 * Tabla con el historial de vehículos, búsqueda por placa y paginación.
 * @param {{vehiculos: object[], onSalida: Function}} props
 */
import { useState } from 'react';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { formatoFecha, formatoMoneda } from "./utils";
export default function TablaVehiculos({ vehiculos, onSalida }) {
  const [filtro, setFiltro] = useState('');
 
  // Plantilla de la columna "Tipo": etiqueta de color
  const plantillaTipo = (v) => (
    <Tag value={v.tipo === 'CARRO' ? 'Carro' : 'Moto'} severity={v.tipo === 'CARRO' ? 'info' : 'warning'} />
  );
 
  // Plantilla de la columna "Estado"
  const plantillaEstado = (v) =>
    v.horaSalida ? <Tag value="Finalizado" severity="secondary" /> : <Tag value="En parqueadero" severity="success" />;
 
  // Plantilla de la columna "Acciones": solo para vehículos activos
  const plantillaAcciones = (v) =>
    !v.horaSalida && (
      <Button
        label="Salida"
        icon="pi pi-sign-out"
        size="small"
        severity="danger"
        onClick={() => onSalida(v)}
      />
    );
 
  const encabezado = (
    <span className="p-input-icon-left buscador">
      <i className="pi pi-search" />
      <InputText
        value={filtro}
        onChange={(e) => setFiltro(e.target.value.toUpperCase())}
        placeholder="Buscar por placa"
      />
    </span>
  );
 
  return (
    <DataTable
      value={vehiculos}
      header={encabezado}
      globalFilter={filtro}
      globalFilterFields={['placa']}
      paginator
      rows={5}
      sortField="horaEntrada"
      sortOrder={-1}
      emptyMessage="No hay vehículos registrados"
      stripedRows
    >
      <Column field="placa" header="Placa" sortable />
      <Column header="Tipo" body={plantillaTipo} />
      <Column header="Entrada" body={(v) => formatoFecha(v.horaEntrada)} sortField="horaEntrada" sortable />
      <Column header="Salida" body={(v) => formatoFecha(v.horaSalida)} />
      <Column header="Valor" body={(v) => (v.valorPagado != null ? formatoMoneda(v.valorPagado) : '—')} />
      <Column header="Estado" body={plantillaEstado} />
      <Column header="Acciones" body={plantillaAcciones} />
    </DataTable>
  );
}
