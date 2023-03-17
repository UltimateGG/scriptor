import { ref, update } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import EditableText from '../components/EditableText';
import useAuthContext from '../contexts/AuthContext';
import useScriptsContext from '../contexts/ScriptsContext';
import { db, Script } from '../firebase';
import { Box, Icon, IconEnum, Paper, theme } from '../Jet';


const TitleStyle = styled.h4`
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100% - 7.6rem);
`;

const SectionStyle = styled(Paper)`
  margin: 1rem 6rem;
`;

const PhantomSectionStyle = styled(SectionStyle)`
  position: relative;
  margin-left: 0;
  margin-right: 0;
  margin-bottom: 24rem;
  width: 100%;
  min-height: 14rem;
  height: 100%;
  background-color: transparent;
  border: none;
  border-radius: 0;

  & > * {
    display: none;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.02);

    & > * {
      display: block;
    }
  }
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

  const updateScript = (values: any) => {
    update(ref(db, `scripts/${scriptId}`), values);
  }
      

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
      </Box>
      <Box flexDirection="column" style={{
        overflowY: 'auto',
        height: '100%',
        paddingTop: '6rem'
      }}>
        <SectionStyle>
          <EditableText variant="h1" value={script.name} onChanged={str => {
            let cleanName = str.trimStart();
            if (cleanName.length > 100) cleanName = cleanName.slice(0, 100);

            updateScript({ name: cleanName });
          }} />
          <EditableText value={script.description} onChanged={str => {
            let cleanDescription = str.trimStart();
            if (cleanDescription.length > 500) cleanDescription = cleanDescription.slice(0, 500);

            updateScript({ description: cleanDescription });
          }} />
        </SectionStyle>

        {[].map((_, i) => (
          <SectionStyle key={i}>
            <h1>{_}</h1>
          </SectionStyle>
        ))}

        <PhantomSectionStyle>
          <Icon icon={IconEnum.plus_circle} size={32} style={{ position: 'absolute', top: '50%', right: '3rem', transform: 'translateY(-50%)', cursor: 'pointer' }} color={theme.colors.background[9]} />
        </PhantomSectionStyle>
      </Box>
    </>
  );
}

export default ScriptPage;
