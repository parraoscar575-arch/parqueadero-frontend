/**
 * Muestra los cupos ocupados y disponibles por tipo de vehículo.
 * @param {{ocupados: {CARRO: number, MOTO: number}}} props
 */
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { CUPOS } from "./utils";
 
export default function ResumenCupos({ ocupados }) {
  // Lista de tipos para recorrerla con map() y no repetir código
  const tipos = [
    { clave: 'CARRO', titulo: 'Carros', icono: 'pi-car' },
    { clave: 'MOTO', titulo: 'Motos', icono: 'pi-bolt' }
  ];
 
  return (
    <section className="resumen">
      {tipos.map((t) => {
        const usados = ocupados[t.clave];
        const total = CUPOS[t.clave];
        const porcentaje = Math.round((usados / total) * 100);
 
        return (
          <Card key={t.clave} title={<span><i className={`pi ${t.icono}`}></i> {t.titulo}</span>}>
            <p>
              Ocupados: <strong>{usados}</strong> de {total} · Disponibles:{' '}
              <strong>{total - usados}</strong>
            </p>
            <ProgressBar value={porcentaje} showValue />
          </Card>
        );
      })}
    </section>
  );
}
