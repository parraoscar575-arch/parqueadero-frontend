/**
 * Ventana modal para confirmar la salida y mostrar el valor a pagar.
 * @param {{vehiculo: object|null, onConfirmar: Function, onCancelar: Function}} props
 */
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { calcularCobro, minutosEstadia, formatoFecha, formatoMoneda } from "./utils";
export default function DialogoSalida({ vehiculo, onConfirmar, onCancelar }) {
  // Si no hay vehículo seleccionado, el modal permanece oculto
  const visible = vehiculo !== null;
  const ahora = new Date();
 
  const pie = (
    <div>
      <Button label="Cancelar" icon="pi pi-times" text onClick={onCancelar} />
      <Button label="Confirmar salida" icon="pi pi-check" onClick={() => onConfirmar(vehiculo)} />
    </div>
  );
 
  return (
    <Dialog
      header="Registrar salida"
      visible={visible}
      style={{ width: '26rem' }}
      onHide={onCancelar}
      footer={pie}
      modal
    >
      {vehiculo && (
        <ul className="detalle">
          <li><strong>Placa:</strong> {vehiculo.placa}</li>
          <li><strong>Entrada:</strong> {formatoFecha(vehiculo.horaEntrada)}</li>
          <li><strong>Salida:</strong> {formatoFecha(ahora.toISOString())}</li>
          <li><strong>Tiempo:</strong> {minutosEstadia(vehiculo.horaEntrada, ahora)} min</li>
          <li className="total"><strong>Total a pagar:</strong> {formatoMoneda(calcularCobro(vehiculo, ahora))}</li>
        </ul>
      )}
    </Dialog>
  );
}
