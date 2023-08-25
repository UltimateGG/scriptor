import { ref, update } from 'firebase/database';
import { db, Script, Shot as ShotType } from '../firebase';
import EditableText from './EditableText';
import { Checkbox, Icon } from '@ultimategg/jetdesign';


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
    <div className="shot-container">
      <div className="bg-background-700 p-2 rounded transition-opacity duration-200" style={{ opacity: shot.completed && script.productionMode ? 0.45 : 1 }}>
        <div className="flex items-center gap-4" style={{ marginBottom: '0.8rem' }}>
          {script.productionMode && <Checkbox value={shot.completed} onChange={checked => updateShot('completed', checked, 100)} />}
          <h5 style={{ margin: 0 }}>Scene #{num + 1}</h5>
        </div>

        <EditableText variant="h5" value={shot.name} onChanged={value => updateShot('name', value, 500)} maxLength={500} style={{ fontWeight: 'bold' }} disabled={script.productionMode && shot.completed} />

        <EditableText markdown value={shot.description} onChanged={value => updateShot('description', value, 100_000)} maxLength={100_000} disabled={script.productionMode && shot.completed} />

        <Icon icon="minus-circle" onClick={onRemove} size={32} style={{ position: 'absolute', top: '50%', right: '2rem', transform: 'translateY(-50%)' }} color="text-950" />
      </div>
    </div>
  );
}

export default Shot;
