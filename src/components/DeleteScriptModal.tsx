import { ref, remove } from 'firebase/database';
import { useState } from 'react';
import { db, Script } from '../firebase';
import { Button, Modal, Progress } from '@ultimategg/jetdesign';


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
      closeOnOutsideClick={!loading}
    >
      <p>Are you sure you want to delete "{script?.name}"?</p>
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
          onClick={deleteScript}
          disabled={loading}
        >
          Delete
        </Button>
      </div>

      {loading && <Progress linear />}
    </Modal>
  );
}

export default DeleteScriptModal;