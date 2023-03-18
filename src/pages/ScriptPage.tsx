import { push, ref, update } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import DeleteShotModal from '../components/DeleteShotModal';
import EditableText from '../components/EditableText';
import Shot, { ShotStyle } from '../components/Shot';
import useAuthContext from '../contexts/AuthContext';
import useScriptsContext from '../contexts/ScriptsContext';
import { db, Script, Shot as ShotType } from '../firebase';
import { Box, Icon, IconEnum, Switch, theme } from '../Jet';
import { DragDropContext, Draggable } from '@hello-pangea/dnd';
import { StrictModeDroppable } from '../components/StrictModeDroppable';



const TitleStyle = styled.h4`
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100% - 15rem);
`;

const IntroStyle = styled(ShotStyle)`
  border: 0;
  margin: 1rem 6rem;
  margin-bottom: 3.4rem;

  @media (max-width: 768px) {
    margin: 1rem 2rem;
  }
`;

const PhantomSectionStyle = styled(ShotStyle)`
  position: relative;
  margin-left: 0;
  margin-right: 0;
  margin-bottom: 24rem;
  width: 100%;
  min-height: 8rem;
  max-height: 8rem;
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
      <Box alignItems="center" justifyContent="space-between" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        height: '3.6rem',
        padding: '1rem 0.2rem',
        backgroundColor: theme.colors.background[1]
      }}>
        <Box alignItems="center" style={{ width: '80%' }}>
          <Icon icon={IconEnum.left} style={{ cursor: 'pointer', marginRight: '0.2rem' }} size={32} onClick={() => navigate(-1)} />
          <TitleStyle style={{ margin: 0 }}>{script.name}</TitleStyle>
        </Box>

        <Box alignItems="center" style={{ marginRight: '2rem' }}>
          <label htmlFor="prod" style={{ marginRight: '1rem' }}>Production Mode</label>
          <Switch checked={script.productionMode} onCheck={checked => updateScript({ productionMode: checked })} name="prod" />
        </Box>
      </Box>
      <Box flexDirection="column" style={{
        overflowY: 'auto',
        height: '100%',
        paddingTop: '6rem'
      }}>
        <IntroStyle>
          <small>Welcome to the script for</small>
          <div style={{ height: '1.2rem' }}></div>
          <EditableText variant="h1" value={script.name} maxLength={100} onChanged={str => updateScript({ name: str.trimStart() })} />

          <EditableText markdown value={script.description} onChanged={str => updateScript({ description: str.trimStart() })} maxLength={100_000} />
        </IntroStyle>

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

        <PhantomSectionStyle>
          <Icon onClick={createShot} icon={IconEnum.plus_circle} size={32} style={{ position: 'absolute', top: '50%', right: '3rem', transform: 'translateY(-50%)', cursor: 'pointer' }} color={theme.colors.background[9]} />
        </PhantomSectionStyle>
      </Box>

      <DeleteShotModal shot={deleteShotModal} script={script} open={deleteShotModal !== null} onClose={() => setDeleteShotModal(null)} />
    </>
  );
}

export default ScriptPage;
