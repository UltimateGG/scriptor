import { ref, remove } from 'firebase/database';
import React, { useState } from 'react';
import { db, Script } from '../firebase';
import { Button, Modal, Progress } from '../Jet';


interface DeleteScriptModalProps {
  script: Script | null;
  open: boolean;
  onClose: () => void;
}

const DeleteScriptModal = ({ script, open, onClose }: DeleteScriptModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const deleteScript = async () => {
    setLoading(true);
    await remove(ref(db, `scripts/${script?.id}`));
    setLoading(false);
    onClose();
  }

  return (
    <Modal
      title="Delete Script"
      open={open}
      onClose={onClose}
      closeOnOutsideClick
    >
      <p>Are you sure you want to delete "{script?.name}"?</p>
      <p>This action cannot be undone.</p>

      <Button
        color="danger"
        style={{ margin: '2rem 0 1rem 0' }}
        block
        onClick={deleteScript}
      >
        Delete
      </Button>
      <Button
        color="secondary"
        block
        onClick={onClose}
      >
        Cancel
      </Button>

      {loading && <Progress indeterminate thin />}
    </Modal>
  );
}

export default DeleteScriptModal;