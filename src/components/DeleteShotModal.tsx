import { ref, remove } from 'firebase/database';
import { useState } from 'react';
import { db, Script, Shot } from '../firebase';
import { Button, Modal, Progress } from '@ultimategg/jetdesign';


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
      title="Delete Scene"
      open={open}
      onClose={onClose}
      closeOnOutsideClick
    >
      <p>Are you sure you want to delete "{shot?.name}"?</p>
      <p>This action cannot be undone.</p>

      
      <div className="flex gap-2 mt-4 justify-end">
        <Button
          display="text"
          color="secondary"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          color="danger"
          onClick={deleteShot}
          disabled={loading}
        >
          Delete
        </Button>
      </div>

      {loading && <Progress linear />}
    </Modal>
  );
}

export default DeleteShotModal;