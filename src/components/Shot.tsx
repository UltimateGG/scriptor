import { ref, update } from 'firebase/database';
import React from 'react';
import styled from 'styled-components';
import { db, Script, Shot as ShotType } from '../firebase';
import { Box, Checkbox, Icon, IconEnum, Paper, theme } from '../Jet';
import EditableText from './EditableText';


const ContainerStyle = styled.div`
  position: relative;
  padding: 1rem 6rem;

  & > div > svg {
    display: none;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.02);

    & > div > svg {
      display: block;
    }
  }

  @media (max-width: 768px) {
    padding: 1rem 2rem;
  }
`;

export const ShotStyle = styled(Paper)`
  transition: opacity 0.2s;
`;

interface ShotProps {
  script: Script;
  shot: ShotType;
  num: number;
  onRemove: () => void;
}

const Shot = ({ script, shot, num, onRemove } : ShotProps) => {
  const updateShot = (field: string, value: string | boolean, maxLen: number) => {
    update(ref(db, `scripts/${script.id}/shots/${shot.id}`), {
      [field]: typeof value === 'string' ? value.substring(0, maxLen) : value,
    });
  }

  return (
    <ContainerStyle>
      <ShotStyle style={{ opacity: shot.completed && script.productionMode ? 0.45 : 1 }}>
        <Box alignItems="center" style={{ marginBottom: '0.8rem' }} spacing="0.8rem">
          {script.productionMode && <Checkbox style={{ display: 'inline-block' }} checked={shot.completed} onCheck={checked => updateShot('completed', checked, 100)} />}
          <h3 style={{ display: 'inline-block', margin: 0 }}>Shot #{num + 1}</h3>
        </Box>

        <EditableText variant="h5" value={shot.name} onChanged={value => updateShot('name', value, 500)} maxLength={500} style={{ fontWeight: 'bold' }} />

        <EditableText markdown value={shot.description} onChanged={value => updateShot('description', value, 100_000)} maxLength={100_000} />

        <Icon icon={IconEnum.minus_circle} onClick={onRemove} size={32} style={{ position: 'absolute', top: '50%', right: '2rem', transform: 'translateY(-50%)', cursor: 'pointer' }} color={theme.colors.background[9]} />
      </ShotStyle>
    </ContainerStyle>
  );
}

export default Shot;
