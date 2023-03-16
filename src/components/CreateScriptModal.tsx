import React, { useState } from 'react';
import useAuthContext from '../contexts/AuthContext';
import { Button, Modal, Progress, TextField } from '../Jet';


interface CreateScriptModalProps {
  open: boolean;
  onClose: () => void;
}

const isAsciiPrintable = (str: string) => /^[\x20-\x7E]*$/.test(str);

const CreateScriptModal = ({ open, onClose }: CreateScriptModalProps) => {
  const [name, setName] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useAuthContext();
  if (!user) return null;


  const onNameChange = (str: string) => {
    const typed = str.slice(name.length);
    if (typed.length === 0) return setName(str);
    if (typed.length === 0 || !isAsciiPrintable(typed) || str.length > 50) return;
    
    setName(str.trimStart());
    setNameError('');
  }

  const validate = () => {
    if (name.length === 0) return setNameError('Script name cannot be empty');
    if (!isAsciiPrintable(name)) return setNameError('Invalid characters in name');
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
    // await ZentrixChat.create(name, encrypted, password, [ user.id ]);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);

    reset();
    onClose();
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
      <label htmlFor="script-name">Name</label><br />
      <TextField
        placeholder="Something cool.."
        name="chat-name"
        style={{ marginBottom: '1rem' }}
        autoFocus
        fullWidth
        value={name}
        onChanged={onNameChange}
        error={nameError}
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
    </Modal>
  );
}

export default CreateScriptModal;