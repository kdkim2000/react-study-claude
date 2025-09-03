import { Button, ButtonProps } from '@mui/material';
import { ReactNode } from 'react';

interface CustomButtonProps extends Omit<ButtonProps, 'children'> {
  children: ReactNode;
  loading?: boolean;
}

const CustomButton = ({ 
  children, 
  loading = false, 
  disabled,
  ...props 
}: CustomButtonProps) => {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
    >
      {loading ? '로딩 중...' : children}
    </Button>
  );
};

export default CustomButton;