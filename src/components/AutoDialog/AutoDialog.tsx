import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export interface AutoDialogProps {
  open: boolean;
  title: string;
  details?: string;
  data: {
    action: 'add'|'edit'|'update'|'delete';
    query: string;
  };
  onClose: (callback?: () => void) => void;
}

export default function AutoDialog({
  open,
  title,
  details,
  data,
  onClose
}:AutoDialogProps) {

  const handleClose = () => {
    onClose();
  };

  return (
      <Dialog 
        open={open} 
        onClose={handleClose}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {details && (
            <DialogContentText>
              {details}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Okay</Button>
        </DialogActions>
      </Dialog>
  );
}