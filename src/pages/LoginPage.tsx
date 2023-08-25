import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthContext from '../contexts/AuthContext';


const LoginPage = () => {
  const { signInWithGoogle, user } = useAuthContext();
  const navigate = useNavigate();


  useEffect(() => {
    if (user) navigate('/scripts');
  }, [user, navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <img src="/logo192.png" alt="Scriptor" style={{ width: '6rem', height: '6rem' }} />
      <p style={{ margin: '1rem 0' }}>Sign in to Scriptor</p>

      <img src="/google_signin.png" alt="Sign in with Google" onClick={signInWithGoogle} style={{ cursor: 'pointer', width: '200px' }} />
    </div>
  );
}

export default LoginPage;
