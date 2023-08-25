import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateScriptModal from '../components/CreateScriptModal';
import DeleteScriptModal from '../components/DeleteScriptModal';
import useAuthContext from '../contexts/AuthContext';
import useScriptsContext from '../contexts/ScriptsContext';
import { Script } from '../firebase';
import { Icon, Progress } from '@ultimategg/jetdesign';


const ScriptListPage = () => {
  const { user } = useAuthContext();
  const [createScriptModalOpen, setCreateScriptModalOpen] = useState(false);
  const [deleteScriptModal, setDeleteScriptModal] = useState<Script | null>(null);

  const { scripts, loadingScripts } = useScriptsContext();
  const navigate = useNavigate();


  if (!user) return null;
  return (
    <>
      <div className="flex justify-between items-center bg-background-800" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        height: '3.6rem',
        padding: '1rem 2rem',
      }}>
        <h4 style={{ margin: 0 }}>Scripts</h4>
        <Icon icon="file-plus" size={32} onClick={() => setCreateScriptModalOpen(true)} />
      </div>
      <div style={{ height: '3.6rem' }} />

      {loadingScripts ? (
        <div className="flex justify-center items-center" style={{ marginTop: '4rem' }}>
          <Progress />
        </div>
      ) : (<>
        {scripts.length === 0 ? (
          <div className="flex flex-col justify-center items-center" style={{ marginTop: '4rem' }}>
            <h3 style={{ margin: 0 }}>No scripts yet</h3>
            <p style={{ margin: 0 }}>Click the + button to create a new script</p>
          </div>
        ) : (
          <div className="flex flex-col" style={{ paddingBottom: '3.6rem', marginTop: '0.4rem' }}>
            {scripts.map(script => (
              <div className="script flex justify-between items-center cursor-pointer bg-background-700 rounded px-4 py-3 m-4 my-2" key={script.id} onClick={(e) => {
                if (!(e.target as HTMLElement).closest('svg'))
                  navigate(`/scripts/${script.id}`);
              }}>
                <div className="flex flex-col" style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: 'calc(100% - 3.6rem)',
                  wordWrap: 'break-word',
                }}>
                  <h5 style={{ margin: 0 }}>{script.name}</h5>
                  <p className="text-text-600">{script.description}</p>
                </div>

                <Icon icon="trash-2" size={24} color="danger" onClick={() => setDeleteScriptModal(script)} />
              </div>
            ))}
          </div>
        )}
      </>)}

      <CreateScriptModal open={createScriptModalOpen} onClose={() => setCreateScriptModalOpen(false)} />
      <DeleteScriptModal script={deleteScriptModal} open={deleteScriptModal !== null} onClose={() => setDeleteScriptModal(null)} />
    </>
  );
}

export default ScriptListPage;
