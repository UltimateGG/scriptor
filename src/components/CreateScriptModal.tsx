import { push, ref } from 'firebase/database';
import React, { useState } from 'react';
import useScriptsContext from '../contexts/ScriptsContext';
import { db } from '../firebase';
import { Button, Modal, Progress, TextArea, TextField } from '../Jet';


interface CreateScriptModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateScriptModal = ({ open, onClose }: CreateScriptModalProps) => {
  const [name, setName] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [descriptionError, setDescriptionError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { scripts } = useScriptsContext();


  const validate = () => {
    if (name.length === 0) return setNameError('Script name cannot be empty');
    if (name.length > 100) return setNameError('Max 100 characters');
    setNameError('');

    if (description.length > 500) return setDescriptionError(description.length + '/500');
    setDescriptionError('');

    return true;
  }

  const reset = () => {
    setName('');
    setNameError('');
    setDescription('');
    setDescriptionError('');
    setLoading(false);
  }

  const create = async () => {
    if (!validate()) return;
    setLoading(true);
    await push(ref(db, 'scripts'), {
      name,
      description,
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
        <label htmlFor="script-name">Name</label><br />
        <TextField
          placeholder="Movie title.."
          name="script-name"
          style={{ marginBottom: '1rem' }}
          autoFocus
          fullWidth
          value={name}
          onChanged={(str) => {
            setName(str.trimStart());
            validate();
          }}
          error={nameError}
          onBlur={validate}
          disabled={loading}
        />

        <label htmlFor="script-description">Description</label><br />
        <TextArea
          placeholder="Movie description.."
          name="script-description"
          style={{ marginBottom: '1rem' }}
          maxRows={8}
          fullWidth
          value={description}
          onChanged={(str) => {
            setDescription(str.trimStart());
            validate();
          }}
          error={descriptionError}
          onBlur={validate}
          disabled={loading}
        />

        <Button
          style={{ marginTop: '1rem', marginBottom: '0.2rem' }}
          block
          onClick={create}
          disabled={nameError.length > 0 || loading}
        >
          Create
        </Button>

        {loading && <Progress indeterminate thin />}
        </>
      )}
    </Modal>
  );
}

export default CreateScriptModal;