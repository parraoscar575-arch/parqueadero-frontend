export type TipoVehiculo = 'CARRO' | 'MOTO';

/** Valor a cobrar por hora (pesos colombianos). */
export const TARIFAS: Record<TipoVehiculo, number> = {
  CARRO: 5000,
  MOTO: 2000,
};

/** Cupos totales del parqueadero (ajusta los números). */
export const CUPOS: Record<TipoVehiculo, number> = {
  CARRO: 20,
  MOTO: 20,
};

/** Opciones para el selector de tipo de vehículo. */
export const TIPOS_VEHICULO: { label: string; value: TipoVehiculo }[] = [
  { label: 'Carro', value: 'CARRO' },
  { label: 'Moto', value: 'MOTO' },
];

/**
 * Valida el formato de una placa colombiana.
 * Carro: tres letras y tres números (ABC123).
 * Moto: tres letras, dos números y una letra (ABC12D).
 */
export function placaValida(placa: string, tipo: string): boolean {
  const p = placa.trim().toUpperCase();
  if (tipo === 'CARRO') return /^[A-Z]{3}\d{3}$/.test(p);
  if (tipo === 'MOTO') return /^[A-Z]{3}\d{2}[A-Z]$/.test(p);
  return false;
}

/** Minutos transcurridos entre la entrada y la salida (o ahora). */
export function minutosEstadia(horaEntrada: string | Date, horaSalida?: string | Date | null): number {
  const inicio = new Date(horaEntrada).getTime();
  const fin = horaSalida ? new Date(horaSalida).getTime() : Date.now();
  return Math.max(1, Math.ceil((fin - inicio) / 60000));
}
/** Cobro por horas (se cobra la hora o fracción). */
export function calcularCobro(
  vehiculo: { tipo: string; horaEntrada: string | Date },
  horaSalida?: string | Date | null
): number {
  const horas = Math.ceil(minutosEstadia(vehiculo.horaEntrada, horaSalida) / 60);
  return horas * TARIFAS[vehiculo.tipo as TipoVehiculo];
}
export function formatoMoneda(valor: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
}

export function formatoFecha(fecha?: string | Date | null): string {
  if (!fecha) return '—';
  return new Date(fecha).toLocaleString('es-CO');
}