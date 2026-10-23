/**
* Encabezado de la aplicación.
* Componente de presentación: no maneja estado.
*/
export default function Header() {
return (
<header className="encabezado">
<i className="pi pi-car" style={{ fontSize: '1.8rem' }} aria-hidden="true"></i>
<div>
<h1>Parqueadero</h1>
<p>Control de ingreso, salida y cobro de vehículos</p>
</div>
</header>
);
}