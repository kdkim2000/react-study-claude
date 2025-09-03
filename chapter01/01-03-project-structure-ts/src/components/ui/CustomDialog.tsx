import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { ReactNode } from 'react';
import CustomButton from './CustomButton';

interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const CustomDialog = ({
  open,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = '확인',
  cancelText = '취소',
  maxWidth = 'sm'
}: CustomDialogProps) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {children}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <CustomButton 
          variant="outlined" 
          onClick={onClose}
        >
          {cancelText}
        </CustomButton>
        {onConfirm && (
          <CustomButton 
            variant="contained" 
            onClick={onConfirm}
          >
            {confirmText}
          </CustomButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;