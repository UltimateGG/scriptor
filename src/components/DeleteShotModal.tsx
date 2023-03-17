import { ref, remove } from 'firebase/database';
import React, { useState } from 'react';
import { db, Script, Shot } from '../firebase';
import { Button, Modal, Progress } from '../Jet';


interface DeleteShotModalProps {
  script: Script | null;
  shot: Shot | null;
  open: boolean;
  onClose: () => void;
}

const DeleteShotModal = ({ script, shot, open, onClose }: DeleteShotModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);


  const deleteShot = async () => {
    setLoading(true);
    if (script && shot) await remove(ref(db, `scripts/${script?.id}/shots/${shot?.id}`));
    setLoading(false);
    onClose();
  }

  return (
    <Modal
      title="Delete Shot"
      open={open}
      onClose={onClose}
      closeOnOutsideClick
    >
      <p>Are you sure you want to delete "{shot?.name}"?</p>
      <p>This action cannot be undone.</p>

      <Button
        color="danger"
        style={{ margin: '2rem 0 1rem 0' }}
        block
        onClick={deleteShot}
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

export default DeleteShotModal;