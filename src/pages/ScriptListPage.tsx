import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CreateScriptModal from '../components/CreateScriptModal';
import DeleteScriptModal from '../components/DeleteScriptModal';
import useAuthContext from '../contexts/AuthContext';
import useScriptsContext from '../contexts/ScriptsContext';
import { Script } from '../firebase';
import { Box, Icon, IconEnum, Paper, Progress, theme } from '../Jet';


const ScriptStyle = styled(Paper)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.4rem 1rem;
  height: 4rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${theme.colors.background[2]};
  }
`;

const ScriptListPage = () => {
  const { user } = useAuthContext();
  const [createScriptModalOpen, setCreateScriptModalOpen] = useState(false);
  const [deleteScriptModal, setDeleteScriptModal] = useState<Script | null>(null);

  const { scripts, loadingScripts } = useScriptsContext();
  const navigate = useNavigate();


  if (!user) return null;
  return (
    <>
      <Box justifyContent="space-between" alignItems="center" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        height: '3.6rem',
        padding: '1rem 2rem',
        backgroundColor: theme.colors.background[1]
      }}>
        <h2 style={{ margin: 0 }}>Scripts</h2>
        <Icon icon={IconEnum.add_script} style={{ cursor: 'pointer' }} size={32} onClick={() => setCreateScriptModalOpen(true)} />
      </Box>
      <div style={{ height: '3.6rem' }} />

      {loadingScripts ? (
        <Box justifyContent="center" alignItems="center" style={{ marginTop: '4rem' }}>
          <Progress circular indeterminate />
        </Box>
      ) : (<>
        {scripts.length === 0 ? (
          <Box flexDirection="column" justifyContent="center" alignItems="center" style={{ marginTop: '4rem' }}>
            <h3 style={{ margin: 0 }}>No scripts yet</h3>
            <p style={{ margin: 0 }}>Click the + button to create a new script</p>
          </Box>
        ) : (
          <Box flexDirection="column" style={{ paddingBottom: '3.6rem', marginTop: '0.4rem' }}>
            {scripts.map(script => (
              <ScriptStyle key={script.id} onClick={(e) => {
                if (!(e.target as HTMLElement).closest('svg'))
                  navigate(`/scripts/${script.id}`);
              }}>
                <Box flexDirection="column" style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: 'calc(100% - 3.6rem)',
                  wordWrap: 'break-word',
                }}>
                  <h4 style={{ margin: 0 }}>{script.name}</h4>
                  <p style={{ color: theme.colors.text[6] }}>{script.description}</p>
                </Box>

                <Icon icon={IconEnum.trash} style={{ cursor: 'pointer' }} size={32} color={theme.colors.danger[0]} onClick={() => setDeleteScriptModal(script)} />
              </ScriptStyle>
            ))}
          </Box>
        )}
      </>)}

      <CreateScriptModal open={createScriptModalOpen} onClose={() => setCreateScriptModalOpen(false)} />
      <DeleteScriptModal script={deleteScriptModal} open={deleteScriptModal !== null} onClose={() => setDeleteScriptModal(null)} />
    </>
  );
}

export default ScriptListPage;
