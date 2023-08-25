import { push, ref } from 'firebase/database';
import { useState } from 'react';
import useScriptsContext from '../contexts/ScriptsContext';
import { db } from '../firebase';
import { Button, Modal, TextField } from '@ultimategg/jetdesign';


interface CreateScriptModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateScriptModal = ({ open, onClose }: CreateScriptModalProps) => {
  const [name, setName] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { scripts } = useScriptsContext();


  const validate = () => {
    if (name.length === 0) return setNameError('Script name cannot be empty');
    if (name.length > 100) return setNameError('Max 100 characters');
    setNameError('');

    return true;
  }

  const reset = () => {
    setName('');
    setNameError('');
    setLoading(false);
  }

  const create = async () => {
    if (!validate()) return;
    setLoading(true);
    await push(ref(db, 'scripts'), {
      name,
      description: '(Click to edit)',
      shots: [],
      productionMode: false
    });

    onClose();
    setTimeout(() => {
      setLoading(false)
      reset();
    }, 300);
  }

  return (
    <Modal
      title="New Script"
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
    >
      {scripts.length >= 100 ? (
        <p>You have reached the maximum number of scripts (100).</p>
      ) : (
        <>
        <TextField
          label="Name"
          placeholder="Movie title.."
          name="script-name"
          className="w-full"
          style={{ marginBottom: '1rem' }}
          autoFocus
          value={name}
          onChange={str => {
            setName(str.trimStart());
            validate();
          }}
          error={nameError}
          onBlur={validate}
          disabled={loading}
        />

        <Button
          className="w-full mt-4"
          onClick={create}
          disabled={nameError.length > 0 || loading}
          loading={loading}
        >
          Create
        </Button>
        </>
      )}
    </Modal>
  );
}

export default CreateScriptModal;