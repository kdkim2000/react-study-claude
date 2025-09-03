import { useState } from 'react';

export const useDialog = () => {
  const [open, setOpen] = useState(false);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);
  const toggleDialog = () => setOpen(prev => !prev);

  return {
    open,
    openDialog,
    closeDialog,
    toggleDialog,
  };
};