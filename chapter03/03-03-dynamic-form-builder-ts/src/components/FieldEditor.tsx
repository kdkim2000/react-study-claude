import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Divider,
  IconButton,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { FormField, FieldType, FIELD_TYPE_OPTIONS, SelectOption } from '../types/form';
import { v4 as uuidv4 } from 'uuid';

interface FieldEditorProps {
  open: boolean;
  field?: FormField;
  onClose: () => void;
  onSave: (field: FormField) => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({
  open,
  field,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<FormField>>({
    type: 'text',
    label: '',
    placeholder: '',
    required: false,
    disabled: false,
    helperText: '',
    options: []
  });

  const [newOption, setNewOption] = useState({ value: '', label: '' });

  useEffect(() => {
    if (field) {
      setFormData(field);
    } else {
      setFormData({
        type: 'text',
        label: '',
        placeholder: '',
        required: false,
        disabled: false,
        helperText: '',
        options: []
      });
    }
  }, [field, open]);

  const handleInputChange = (key: keyof FormField, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAddOption = () => {
    if (newOption.value && newOption.label) {
      setFormData(prev => ({
        ...prev,
        options: [...(prev.options || []), { ...newOption }]
      }));
      setNewOption({ value: '', label: '' });
    }
  };

  const handleRemoveOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSave = () => {
    if (!formData.label) return;

    const newField: FormField = {
      id: field?.id || uuidv4(),
      type: formData.type as FieldType,
      label: formData.label,
      placeholder: formData.placeholder,
      required: formData.required || false,
      disabled: formData.disabled || false,
      helperText: formData.helperText,
      options: needsOptions(formData.type as FieldType) ? formData.options : undefined,
      validation: {
        required: formData.required || false,
        minLength: formData.validation?.minLength,
        maxLength: formData.validation?.maxLength,
        min: formData.validation?.min,
        max: formData.validation?.max
      }
    };

    onSave(newField);
    onClose();
  };

  const needsOptions = (type: FieldType) => {
    return ['select', 'radio', 'checkbox'].includes(type);
  };

  const showValidationOptions = (type: FieldType) => {
    return ['text', 'textarea', 'email'].includes(type);
  };

  const showNumberValidation = (type: FieldType) => {
    return type === 'number';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {field ? '필드 편집' : '새 필드 추가'}
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} pt={1}>
          {/* 기본 정보 */}
          <Box>
            <Typography variant="h6" gutterBottom>기본 정보</Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <FormControl fullWidth>
                <InputLabel>필드 타입</InputLabel>
                <Select
                  value={formData.type || 'text'}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  label="필드 타입"
                >
                  {FIELD_TYPE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="라벨"
                value={formData.label || ''}
                onChange={(e) => handleInputChange('label', e.target.value)}
                required
              />

              <TextField
                fullWidth
                label="플레이스홀더"
                value={formData.placeholder || ''}
                onChange={(e) => handleInputChange('placeholder', e.target.value)}
              />

              <TextField
                fullWidth
                label="도움말 텍스트"
                value={formData.helperText || ''}
                onChange={(e) => handleInputChange('helperText', e.target.value)}
              />
            </Box>
          </Box>

          {/* 옵션 설정 */}
          <Box display="flex" gap={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.required || false}
                  onChange={(e) => handleInputChange('required', e.target.checked)}
                />
              }
              label="필수 필드"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.disabled || false}
                  onChange={(e) => handleInputChange('disabled', e.target.checked)}
                />
              }
              label="비활성화"
            />
          </Box>

          {/* 유효성 검사 */}
          {showValidationOptions(formData.type as FieldType) && (
            <>
              <Divider />
              <Box>
                <Typography variant="h6" gutterBottom>유효성 검사</Typography>
                <Box display="flex" gap={2}>
                  <TextField
                    label="최소 길이"
                    type="number"
                    value={formData.validation?.minLength || ''}
                    onChange={(e) => handleInputChange('validation', {
                      ...formData.validation,
                      minLength: Number(e.target.value) || undefined
                    })}
                  />
                  <TextField
                    label="최대 길이"
                    type="number"
                    value={formData.validation?.maxLength || ''}
                    onChange={(e) => handleInputChange('validation', {
                      ...formData.validation,
                      maxLength: Number(e.target.value) || undefined
                    })}
                  />
                </Box>
              </Box>
            </>
          )}

          {/* 숫자 유효성 검사 */}
          {showNumberValidation(formData.type as FieldType) && (
            <>
              <Divider />
              <Box>
                <Typography variant="h6" gutterBottom>숫자 범위</Typography>
                <Box display="flex" gap={2}>
                  <TextField
                    label="최소값"
                    type="number"
                    value={formData.validation?.min || ''}
                    onChange={(e) => handleInputChange('validation', {
                      ...formData.validation,
                      min: Number(e.target.value) || undefined
                    })}
                  />
                  <TextField
                    label="최대값"
                    type="number"
                    value={formData.validation?.max || ''}
                    onChange={(e) => handleInputChange('validation', {
                      ...formData.validation,
                      max: Number(e.target.value) || undefined
                    })}
                  />
                </Box>
              </Box>
            </>
          )}

          {/* 선택 옵션 */}
          {needsOptions(formData.type as FieldType) && (
            <>
              <Divider />
              <Box>
                <Typography variant="h6" gutterBottom>선택 옵션</Typography>
                <Box display="flex" gap={2} mb={2}>
                  <TextField
                    label="옵션 값"
                    value={newOption.value}
                    onChange={(e) => setNewOption(prev => ({ ...prev, value: e.target.value }))}
                  />
                  <TextField
                    label="옵션 라벨"
                    value={newOption.label}
                    onChange={(e) => setNewOption(prev => ({ ...prev, label: e.target.value }))}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddOption}
                    startIcon={<AddIcon />}
                    disabled={!newOption.value || !newOption.label}
                  >
                    추가
                  </Button>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {formData.options?.map((option, index) => (
                    <Chip
                      key={index}
                      label={`${option.label} (${option.value})`}
                      onDelete={() => handleRemoveOption(index)}
                      deleteIcon={<DeleteIcon />}
                    />
                  ))}
                </Box>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={!formData.label}
        >
          {field ? '수정' : '추가'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FieldEditor;