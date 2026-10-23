/**
* Capa de servicio: aísla el acceso a los datos del resto de la interfaz.
* - Si existe VITE_API_URL, consume la API REST del back-end (Spring Boot).
* - Si no existe, guarda los datos en localStorage para poder probar el front-end solo.
*/
import { calcularCobro, type TipoVehiculo } from './utils';

export interface Vehiculo {
id: string;
placa: string;
tipo: string;
horaEntrada: string;
horaSalida: string | null;
valorPagado: number | null;
}

const API_URL: string | undefined = (
import.meta as ImportMeta & { env: Record<string, string | undefined> }
).env.VITE_API_URL;
const CLAVE = 'parqueadero.vehiculos';

// ---------- Utilidades de almacenamiento local ----------
const leerLocal = (): Vehiculo[] =>
JSON.parse(localStorage.getItem(CLAVE) || '[]');

const guardarLocal = (lista: Vehiculo[]): void =>
localStorage.setItem(CLAVE, JSON.stringify(lista));

/** Obtiene todos los vehículos registrados. */
export async function listarVehiculos(): Promise<Vehiculo[]> {
if (API_URL) {
const respuesta = await fetch(`${API_URL}/vehiculos`);
if (!respuesta.ok) throw new Error('No fue posible consultar los vehículos');
return respuesta.json();
}
return leerLocal();
}

/**
* Registra la entrada de un vehículo.
* @param datos {placa: string, tipo: string}
* @returns vehículo creado.
*/
export async function registrarEntrada({
placa,
tipo,
}: {
placa: string;
tipo: string;
}): Promise<Vehiculo> {
const nuevo: Vehiculo = {
id: crypto.randomUUID(),
placa,
tipo,
horaEntrada: new Date().toISOString(),
horaSalida: null,
valorPagado: null,
};

if (API_URL) {
const respuesta = await fetch(`${API_URL}/vehiculos`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(nuevo),
});
if (!respuesta.ok) throw new Error('No fue posible registrar la entrada');
return respuesta.json();
}

const lista = leerLocal();
lista.push(nuevo);
guardarLocal(lista);
return nuevo;
}

/**
* Registra la salida de un vehículo y calcula el valor a pagar.
* @param vehiculo Vehículo activo.
* @returns vehículo actualizado.
*/
export async function registrarSalida(vehiculo: Vehiculo): Promise<Vehiculo> {
const salida = new Date();
const actualizado: Vehiculo = {
...vehiculo,
horaSalida: salida.toISOString(),
valorPagado: calcularCobro(vehiculo, salida),



};

if (API_URL) {
const respuesta = await fetch(`${API_URL}/vehiculos/${vehiculo.id}`, {
method: 'PUT',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(actualizado),
});
if (!respuesta.ok) throw new Error('No fue posible registrar la salida');
return respuesta.json();
}

guardarLocal(
leerLocal().map((v: Vehiculo) => (v.id === vehiculo.id ? actualizado : v))
);
return actualizado;
}