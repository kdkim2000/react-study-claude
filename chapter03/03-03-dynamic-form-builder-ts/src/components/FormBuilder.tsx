import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  Alert,
  TextField
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Visibility as PreviewIcon
} from '@mui/icons-material';
import { FormField, FormConfig } from '../types/form';
import FieldEditor from './FieldEditor';

interface FormBuilderProps {
  config: FormConfig;
  onConfigChange: (config: FormConfig) => void;
  onPreview: () => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
  config,
  onConfigChange,
  onPreview
}) => {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingField, setEditingField] = useState<FormField | undefined>();

  const handleAddField = () => {
    setEditingField(undefined);
    setEditorOpen(true);
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setEditorOpen(true);
  };

  const handleSaveField = (field: FormField) => {
    if (editingField) {
      // 기존 필드 수정
      const updatedFields = config.fields.map(f => 
        f.id === field.id ? field : f
      );
      onConfigChange({
        ...config,
        fields: updatedFields
      });
    } else {
      // 새 필드 추가
      onConfigChange({
        ...config,
        fields: [...config.fields, field]
      });
    }
  };

  const handleDeleteField = (fieldId: string) => {
    const updatedFields = config.fields.filter(f => f.id !== fieldId);
    onConfigChange({
      ...config,
      fields: updatedFields
    });
  };

  const handleMoveField = (fromIndex: number, toIndex: number) => {
    const fields = [...config.fields];
    const [movedField] = fields.splice(fromIndex, 1);
    fields.splice(toIndex, 0, movedField);
    
    onConfigChange({
      ...config,
      fields
    });
  };

  const handleTitleChange = (title: string) => {
    onConfigChange({
      ...config,
      title
    });
  };

  const handleDescriptionChange = (description: string) => {
    onConfigChange({
      ...config,
      description
    });
  };

  const getFieldTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      text: '#1976d2',
      number: '#388e3c',
      email: '#f57c00',
      textarea: '#7b1fa2',
      select: '#303f9f',
      radio: '#c2185b',
      checkbox: '#5d4037',
      date: '#0097a7'
    };
    return colors[type] || '#757575';
  };

  return (
    <Box>
      {/* 헤더 */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight="bold">
            폼 빌더
          </Typography>
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              startIcon={<PreviewIcon />}
              onClick={onPreview}
              disabled={config.fields.length === 0}
            >
              미리보기
            </Button>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddField}
            >
              필드 추가
            </Button>
          </Box>
        </Box>

        {/* 폼 설정 */}
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            fullWidth
            label="폼 제목"
            value={config.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="폼의 제목을 입력하세요"
          />
          <TextField
            fullWidth
            label="폼 설명"
            value={config.description || ''}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="폼에 대한 설명을 입력하세요"
            multiline
            rows={2}
          />
        </Box>

        <Box mt={2}>
          <Typography variant="body2" color="text.secondary">
            총 {config.fields.length}개의 필드
          </Typography>
        </Box>
      </Paper>

      {/* 필드 목록 */}
      {config.fields.length === 0 ? (
        <Paper elevation={1} sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            아직 필드가 없습니다
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            "필드 추가" 버튼을 클릭하여 첫 번째 필드를 만들어보세요
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddField}
            size="large"
          >
            첫 번째 필드 추가
          </Button>
        </Paper>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {config.fields.map((field, index) => (
            <Card key={field.id} elevation={1}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={2}>
                    <IconButton size="small" sx={{ cursor: 'grab' }}>
                      <DragIcon />
                    </IconButton>
                    <Box>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography variant="h6" fontWeight="bold">
                          {field.label}
                        </Typography>
                        <Chip
                          label={field.type}
                          size="small"
                          sx={{
                            backgroundColor: getFieldTypeColor(field.type),
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                        {field.required && (
                          <Chip
                            label="필수"
                            size="small"
                            color="error"
                            variant="outlined"
                          />
                        )}
                      </Box>
                      <Box display="flex" flexDirection="column" gap={0.5}>
                        {field.placeholder && (
                          <Typography variant="body2" color="text.secondary">
                            플레이스홀더: {field.placeholder}
                          </Typography>
                        )}
                        {field.helperText && (
                          <Typography variant="body2" color="text.secondary">
                            도움말: {field.helperText}
                          </Typography>
                        )}
                        {field.options && field.options.length > 0 && (
                          <Typography variant="body2" color="text.secondary">
                            옵션: {field.options.map(opt => opt.label).join(', ')}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  <CardActions>
                    <IconButton
                      size="small"
                      onClick={() => handleEditField(field)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteField(field.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Box>
              </CardContent>
            </Card>
          ))}

          {/* 새 필드 추가 버튼 */}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddField}
            sx={{ 
              p: 2,
              border: '2px dashed',
              borderColor: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: 'primary.50'
              }
            }}
          >
            새 필드 추가
          </Button>
        </Box>
      )}

      {/* 필드 편집기 */}
      <FieldEditor
        open={editorOpen}
        field={editingField}
        onClose={() => setEditorOpen(false)}
        onSave={handleSaveField}
      />
    </Box>
  );
};

export default FormBuilder;