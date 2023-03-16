import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import useAuthContext from '../contexts/AuthContext';
import useScriptsContext from '../contexts/ScriptsContext';
import { Script } from '../firebase';
import { Box, Icon, IconEnum, theme } from '../Jet';


const TitleStyle = styled.h4`
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100% - 7.6rem);
`;


const ScriptPage = () => {
  const { scriptId } = useParams();
  const { user } = useAuthContext();
  const { scripts } = useScriptsContext();
  const [script, setScript] = useState<Script | null>(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    if (!user) return;

    const script = scripts.find(script => script.id === scriptId);
  
    setScript(script || null);
  }, [user, scripts, scriptId]);

  if (!user || !script) return null;
  return (
    <>
      <Box alignItems="center" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        height: '3.6rem',
        padding: '1rem 0.2rem',
        backgroundColor: theme.colors.background[1]
      }}>
        <Icon icon={IconEnum.left} style={{ cursor: 'pointer', marginRight: '0.2rem' }} size={32} onClick={() => navigate(-1)} />
        <TitleStyle style={{ margin: 0 }}>{script.name}</TitleStyle>
        <p>{script.description}</p>
        
        <Icon icon={IconEnum.menu} style={{ cursor: 'pointer', marginLeft: 'auto', marginRight: '0.4rem' }} size={32} />
      </Box>
      <div style={{ height: '3.6rem' }} />

      
    </>
  );
}

export default ScriptPage;
