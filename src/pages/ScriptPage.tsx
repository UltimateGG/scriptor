import { push, ref, update } from 'firebase/database';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteShotModal from '../components/DeleteShotModal';
import EditableText from '../components/EditableText';
import Shot from '../components/Shot';
import useAuthContext from '../contexts/AuthContext';
import useScriptsContext from '../contexts/ScriptsContext';
import { db, Script, Shot as ShotType } from '../firebase';
import { DragDropContext, Draggable } from '@hello-pangea/dnd';
import { StrictModeDroppable } from '../components/StrictModeDroppable';
import { Checkbox, Icon } from '@ultimategg/jetdesign';


const ScriptPage = () => {
  const { scriptId } = useParams();
  const { user } = useAuthContext();
  const { scripts } = useScriptsContext();
  const [script, setScript] = useState<Script | null>(null);
  const [deleteShotModal, setDeleteShotModal] = useState<ShotType | null>(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    if (!user) return;

    const script = scripts.find(script => script.id === scriptId);
  
    setScript(script || null);
  }, [user, scripts, scriptId]);

  const updateScript = (values: any) => {
    update(ref(db, `scripts/${scriptId}`), values);
  }

  const createShot = () => {
    push(ref(db, `scripts/${scriptId}/shots`), { name: 'New Shot', description: '', completed: false, order: script?.shots?.length || 0 });
  }

  const onDragEnd = (result: any) => {
    if (!result.destination || !script) return;

    const shot = script.shots.find(shot => shot.id === result.draggableId);
    if (!shot) return;

    const shots = script.shots.filter(shot => shot.id !== result.draggableId);
    shots.splice(result.destination.index, 0, shot);

    const newArr = shots.map((shot, i) => ({ ...shot, order: i }));
    const fbObj: Record<string, ShotType> = {};

    newArr.forEach((shot, i) => fbObj[shot.id] = shot);
    updateScript({ shots: fbObj });
  }

  if (!user || !script) return null;
  return (
    <>
      <div className="flex items-center justify-between bg-background-800" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        height: '3.6rem',
        padding: '1rem 0.2rem',
      }}>
        <div className="flex items-center" style={{ width: '80%' }}>
          <Icon icon="chevron-left" style={{ marginRight: '0.2rem' }} size={32} onClick={() => navigate(-1)} />
          <h5 className="script-title" style={{ margin: 0 }}>{script.name}</h5>
        </div>

        <div className="flex items-center" style={{ marginRight: '2rem' }}>
          <Checkbox isSwitch value={script.productionMode} onChange={c => updateScript({ productionMode: c })} label="Production Mode" />
        </div>
      </div>
      <div className="flex flex-col" style={{
        overflowY: 'auto',
        height: '100%',
        paddingTop: '6rem'
      }}>
        <div className="intro bg-background-700 p-2 rounded">
          <small>Welcome to the script for</small>
          <div style={{ height: '1.2rem' }}></div>
          <EditableText variant="h3" value={script.name} maxLength={100} onChanged={str => updateScript({ name: str.trimStart() })} />

          <EditableText markdown value={script.description} onChanged={str => updateScript({ description: str.trimStart() })} maxLength={100_000} />
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <StrictModeDroppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {script.shots.sort((a, b) => a.order - b.order).map((shot, i) => (
                  <Draggable key={shot.id} draggableId={shot.id} index={i} isDragDisabled={script.productionMode}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Shot key={i} script={script} shot={shot} num={i} onRemove={() => setDeleteShotModal(shot)} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        </DragDropContext>

        <div className="phantom-section">
          <Icon onClick={createShot} icon="plus-circle" size={32} style={{ position: 'absolute', top: '50%', right: '3rem', transform: 'translateY(-50%)' }} color="text-950" />
        </div>
      </div>

      <DeleteShotModal shot={deleteShotModal} script={script} open={deleteShotModal !== null} onClose={() => setDeleteShotModal(null)} />
    </>
  );
}

export default ScriptPage;
