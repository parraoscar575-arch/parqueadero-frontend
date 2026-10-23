/**
 * Formulario para registrar el ingreso de un vehículo.
 * Usa un formulario controlado: el estado de React es la fuente de verdad.
 * @param {{onRegistrar: Function, cuposLlenos: {CARRO: boolean, MOTO: boolean}}} props
 */
import { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { TIPOS_VEHICULO, placaValida } from "./utils";
export default function FormularioIngreso({ onRegistrar, cuposLlenos }) {
  const [placa, setPlaca] = useState('');
  const [tipo, setTipo] = useState('CARRO');
  const [error, setError] = useState('');
 
  // Evento onChange: guarda la placa en mayúsculas y sin espacios
  const manejarPlaca = (e) => {
    setPlaca(e.target.value.toUpperCase().replace(/\s/g, ''));
    setError('');
  };
 
  // Evento onSubmit: valida y envía los datos al componente padre
  const manejarEnvio = async (e) => {
    e.preventDefault(); // evita que el navegador recargue la página
 
    if (!placaValida(placa, tipo)) {
      setError(tipo === 'MOTO' ? 'Formato de moto: ABC12D' : 'Formato de carro: ABC123');
      return;
    }
    if (cuposLlenos[tipo]) {
      setError('No hay cupos disponibles para este tipo de vehículo');
      return;
    }
 
    const registrado = await onRegistrar({ placa, tipo });
    if (registrado) setPlaca(''); // limpia el campo solo si se registró
  };
 
  return (
    <Card title="Registrar ingreso">
      <form onSubmit={manejarEnvio} className="formulario">
        <label htmlFor="placa">Placa</label>
        <InputText
          id="placa"
          value={placa}
          onChange={manejarPlaca}
          maxLength={6}
          placeholder="ABC123"
          className={error ? 'p-invalid' : ''}
        />
 
        <label htmlFor="tipo">Tipo de vehículo</label>
        <Dropdown
          inputId="tipo"
          value={tipo}
          options={TIPOS_VEHICULO}
          onChange={(e) => setTipo(e.value)}
        />
 
        {error && <small className="error">{error}</small>}
 
        <Button type="submit" label="Registrar ingreso" icon="pi pi-sign-in" />
      </form>
    </Card>
  );
}
