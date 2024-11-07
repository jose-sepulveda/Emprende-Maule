import { useNavigate } from 'react-router-dom';
import '../Styles/login-page.css';


function LoginPage() {
    const navigate = useNavigate();

    return (
      <div className='login-buttons-container'>
        <h1 className='title'>Seleccione una opción</h1>
        <button className='login-button' onClick={() => navigate('/login-cliente')}>Cliente</button>
        <button className='login-button' onClick={() => navigate('/login-emprendedor')}>Emprendedor</button>
        <button className='login-button' onClick={() => navigate('/login-administrador')}>Administrador</button>
      </div>  
    );
}


export { LoginPage };

