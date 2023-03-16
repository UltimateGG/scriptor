import React, { useState } from 'react';
import CreateScriptModal from '../components/CreateScriptModal';
import useAuthContext from '../contexts/AuthContext';
import useScriptsContext from '../contexts/ScriptsContext';
import { Box, Icon, IconEnum, Progress, theme } from '../Jet';


const ScriptListPage = () => {
  const { user } = useAuthContext();
  const [createScriptModalOpen, setCreateScriptModalOpen] = useState(false);

  const { scripts, loadingScripts } = useScriptsContext();


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
        <Icon icon={IconEnum.add_chat} style={{ cursor: 'pointer' }} size={32} onClick={() => setCreateScriptModalOpen(true)} />
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
          <Box flexDirection="column" style={{ paddingBottom: '3.6rem' }}>
            {scripts.map(script => (
              <div key={script.id}>
                <h4>{script.name}</h4>
                <p>{script.description}</p>
              </div>
            ))}
          </Box>
        )}

        <CreateScriptModal open={createScriptModalOpen} onClose={() => setCreateScriptModalOpen(false)} />
      </>)}
    </>
  );
}

export default ScriptListPage;
