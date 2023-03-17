import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthContext from '../contexts/AuthContext';
import { Box } from '../Jet';


const LoginPage = () => {
  const { signInWithGoogle, user } = useAuthContext();
  const navigate = useNavigate();


  useEffect(() => {
    if (user) navigate('/scripts');
  }, [user, navigate]);

  return (
    <Box flexDirection="column" justifyContent="center" alignItems="center" style={{ height: '100%' }}>
      <img src={process.env.PUBLIC_URL + '/logo192.png'} alt="Scriptor" style={{ width: '6rem', height: '6rem' }} />
      <p style={{ margin: '1rem 0' }}>Sign in to Scriptor</p>

      <img src={process.env.PUBLIC_URL + '/google_signin.png'} alt="Sign in with Google" onClick={signInWithGoogle} style={{ cursor: 'pointer', width: '200px' }} />
    </Box>
  );
}

export default LoginPage;
