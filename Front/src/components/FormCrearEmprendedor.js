import React from 'react'
import '../Styles/formEmprendedor.css'

const FormCrearEmprendedor = () => {
  return (
    <div className="form-container">
    <h2>Formulario de registro emprendedor</h2>
    <form>
        <div>
            <label htmlFor="nombre">Nombre</label>
            <input id="nombre" type="text" required/>
        </div>
        <div>
            <label htmlFor="apellido-paterno">Apellido Paterno</label>
            <input id="apellido-paterno" type="text" required/>
        </div>
        <div>
            <label htmlFor="apellido-materno">Apellido Materno</label>
            <input id="apellido-materno" type="text" required/>
        </div>
        <div>
            <label htmlFor="rut">RUT</label>
            <input id="rut" type="text" required/>
        </div>
        <div>
            <label htmlFor="telefono">Teléfono</label>
            <input id="telefono" type="tel" required/>
        </div>
        <div>
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" required/>
        </div>
        <div>
            <label htmlFor="correo">Correo</label>
            <input id="correo" type="email" required/>
        </div>
        <div>
            <label htmlFor="direccion">Dirección</label>
            <input id="direccion" type="text" required/>
        </div>
        <div>
            <label htmlFor="tipo-cuenta">Tipo de Cuenta</label>
            <input id="tipo-cuenta" type="text" required/>
        </div>
        <div>
            <label htmlFor="numero-cuenta">Número de Cuenta</label>
            <input id="numero-cuenta" type="number" required/>
        </div>
        <div className='file-uploads'>
            <div>
                <label htmlFor="comprobante">Subir Comprobante</label>
                <input id="comprobante" type="file" required/>
            </div>
            <div>
                <label htmlFor="imagenes-producto">Subir Imagenes del Producto</label>
                <input id="imagenes-producto" type="file" required/>
            </div>
            <div>
                <label htmlFor="imagenes-local">Subir Imagenes del Local</label>
                <input id="imagenes-local" type="file" required/>
            </div>
        </div>
        
        <button type="submit">Registrar</button>
    </form>
</div>
  )
}

export default FormCrearEmprendedor
