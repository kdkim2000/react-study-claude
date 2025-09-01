import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
  IconButton,
  Checkbox
} from '@mui/material';
import {
  Email as EmailIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { User, USER_ROLES } from '../types/user';

interface UserCardProps {
  user: User;
  isSelected: boolean;
  onSelectionChange: (userId: number, selected: boolean) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  isSelected,
  onSelectionChange
}) => {
  const roleInfo = USER_ROLES.find(r => r.value === user.role);
  
  const handleSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelectionChange(user.id, event.target.checked);
  };

  const getAvatarText = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card 
      elevation={isSelected ? 4 : 1}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        border: isSelected ? `2px solid ${roleInfo?.color}` : 'none',
        '&:hover': {
          elevation: 3,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{ 
                bgcolor: roleInfo?.color || '#gray',
                width: 48,
                height: 48,
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}
            >
              {getAvatarText(user.name)}
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3" fontWeight="bold">
                {user.name}
              </Typography>
              <Chip
                label={roleInfo?.label || user.role}
                size="small"
                sx={{
                  backgroundColor: roleInfo?.color || '#gray',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.75rem'
                }}
              />
            </Box>
          </Box>
          <Checkbox
            checked={isSelected}
            onChange={handleSelectionChange}
            color="primary"
          />
        </Box>

        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <EmailIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <BusinessIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {user.department}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <CalendarIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              입사일: {formatDate(user.joinDate)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserCard;