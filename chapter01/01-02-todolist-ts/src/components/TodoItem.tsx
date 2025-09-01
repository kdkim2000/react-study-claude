import React, { useState } from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
  TextField,
  Box,
  Chip,
  Typography
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Flag as PriorityIcon
} from '@mui/icons-material';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim() !== '') {
      onEdit(todo.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      handleCancel();
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
      default:
        return '#9e9e9e';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <ListItem
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        mb: 1,
        backgroundColor: todo.completed ? 'grey.50' : 'background.paper',
        opacity: todo.completed ? 0.7 : 1,
      }}
      disablePadding
    >
      <ListItemButton onClick={() => onToggle(todo.id)} disabled={isEditing}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={todo.completed}
            tabIndex={-1}
            disableRipple
            color="primary"
          />
        </ListItemIcon>

        <ListItemText
          sx={{ flex: 1 }}
          primary={
            isEditing ? (
              <TextField
                fullWidth
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyPress}
                autoFocus
                size="small"
                variant="outlined"
                sx={{ mt: 1 }}
              />
            ) : (
              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    fontWeight: todo.completed ? 'normal' : 'medium',
                    color: todo.completed ? 'text.secondary' : 'text.primary'
                  }}
                >
                  {todo.text}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(todo.createdAt)}
                  </Typography>
                  {todo.priority && (
                    <Chip
                      icon={<PriorityIcon />}
                      label={todo.priority}
                      size="small"
                      sx={{
                        height: '20px',
                        fontSize: '0.75rem',
                        backgroundColor: getPriorityColor(todo.priority),
                        color: 'white',
                        '& .MuiChip-icon': {
                          color: 'white'
                        }
                      }}
                    />
                  )}
                  {todo.category && (
                    <Chip
                      label={todo.category}
                      size="small"
                      variant="outlined"
                      sx={{
                        height: '20px',
                        fontSize: '0.75rem'
                      }}
                    />
                  )}
                </Box>
              </Box>
            )
          }
        />

        <Box display="flex" alignItems="center" gap={0.5}>
          {isEditing ? (
            <>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                color="primary"
              >
                <SaveIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                color="secondary"
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                color="primary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(todo.id);
                }}
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>
      </ListItemButton>
    </ListItem>
  );
};

export default TodoItem;