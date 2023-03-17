import { ref, update } from 'firebase/database';
import React from 'react';
import styled from 'styled-components';
import { db, Shot as ShotType } from '../firebase';
import { Icon, IconEnum, Paper, theme } from '../Jet';
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
`;

export const ShotStyle = styled(Paper)`
`;

interface ShotProps {
  scriptId: string;
  shot: ShotType;
  num: number;
  onRemove: () => void;
}

const Shot = ({ scriptId, shot, num, onRemove } : ShotProps) => {
  const updateShot = (field: string, value: string, maxLen: number) => {
    update(ref(db, `scripts/${scriptId}/shots/${shot.id}`), {
      [field]: value.substring(0, maxLen)
    });
  }

  return (
    <ContainerStyle>
      <ShotStyle>
        <h3>Shot #{num + 1}</h3>
        <EditableText variant="h5" value={shot.name} onChanged={value => updateShot('name', value, 500)} maxLength={500} style={{ fontWeight: 'bold' }} />

        <EditableText value={shot.description} onChanged={value => updateShot('description', value, 100_000)} maxLength={100_000} />

        <Icon icon={IconEnum.minus_circle} onClick={onRemove} size={32} style={{ position: 'absolute', top: '50%', right: '2rem', transform: 'translateY(-50%)', cursor: 'pointer' }} color={theme.colors.background[9]} />
      </ShotStyle>
    </ContainerStyle>
  );
}

export default Shot;
