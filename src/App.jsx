/**
 * Componente raíz: coordina el estado global de la aplicación.
 * Estado: lista de vehículos, vehículo seleccionado para salida y carga inicial.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import ResumenCupos from './ResumenCupos.jsx';
import FormularioIngreso from './Formularioingreso.jsx';
import TablaVehiculos from './TablaVehiculos.jsx';
import DialogoSalida from './DialogoSalida.jsx';
import { listarVehiculos, registrarEntrada, registrarSalida } from './services';
import { CUPOS, formatoMoneda } from './utils';

export default function App() {
  const [vehiculos, setVehiculos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const toast = useRef(null);

  const mostrar = (severity, summary, detail) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  useEffect(() => {
    listarVehiculos()
      .then(setVehiculos)
      .catch((e) => mostrar('error', 'Error', e.message));
  }, []);

  const ocupados = useMemo(() => {
    const activos = vehiculos.filter((v) => !v.horaSalida);
    return {
      CARRO: activos.filter((v) => v.tipo === 'CARRO').length,
      MOTO: activos.filter((v) => v.tipo === 'MOTO').length,
    };
  }, [vehiculos]);

  const cuposLlenos = {
    CARRO: ocupados.CARRO >= CUPOS.CARRO,
    MOTO: ocupados.MOTO >= CUPOS.MOTO,
  };

  const handleEntrada = async (datos) => {
    try {
      const nuevo = await registrarEntrada(datos);
      setVehiculos((prev) => [nuevo, ...prev]);
      mostrar('success', 'Ingreso registrado', `Placa ${nuevo.placa}`);
      return true;
    } catch (e) {
      mostrar('error', 'Error', e.message);
      return false;
    }
  };

  const handleSalida = async () => {
    if (!seleccionado) return;
    try {
      const actualizado = await registrarSalida(seleccionado);
      setVehiculos((prev) =>
        prev.map((v) => (v.id === actualizado.id ? actualizado : v))
      );
      mostrar(
        'success',
        'Salida registrada',
        `Total a cobrar: ${formatoMoneda(actualizado.valorPagado ?? 0)}`
      );
      setSeleccionado(null);
    } catch (e) {
      mostrar('error', 'Error', e.message);
    }
  };

  return (
    <div className="app">
      <Toast ref={toast} />
      <Header />

      <main>
        <ResumenCupos ocupados={ocupados} cupos={CUPOS} />
        <FormularioIngreso onRegistrar={handleEntrada} cuposLlenos={cuposLlenos} />
        <TablaVehiculos vehiculos={vehiculos} onSalida={setSeleccionado} />
      </main>

      <DialogoSalida
        visible={!!seleccionado}
        vehiculo={seleccionado}
        onHide={() => setSeleccionado(null)}
        onConfirmar={handleSalida}
      />

      <Footer />
    </div>
  );
}