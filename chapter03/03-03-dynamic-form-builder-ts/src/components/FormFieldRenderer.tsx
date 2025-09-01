import React from 'react';
import {
  TextField,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Box
} from '@mui/material';
import { FormField, ValidationError } from '../types/form';

interface FormFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (fieldId: string, value: any) => void;
  error?: ValidationError;
}

const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  field,
  value,
  onChange,
  error
}) => {
  const handleChange = (newValue: any) => {
    onChange(field.id, newValue);
  };

  const commonProps = {
    fullWidth: true,
    disabled: field.disabled,
    error: !!error,
    helperText: error?.message || field.helperText
  };

  switch (field.type) {
    case 'text':
    case 'email':
      return (
        <TextField
          {...commonProps}
          label={field.label}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          type={field.type}
          required={field.required}
        />
      );

    case 'number':
      return (
        <TextField
          {...commonProps}
          label={field.label}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => handleChange(Number(e.target.value) || '')}
          type="number"
          required={field.required}
          inputProps={{
            min: field.validation?.min,
            max: field.validation?.max
          }}
        />
      );

    case 'textarea':
      return (
        <TextField
          {...commonProps}
          label={field.label}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          multiline
          rows={4}
          required={field.required}
        />
      );

    case 'date':
      return (
        <TextField
          {...commonProps}
          label={field.label}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          type="date"
          required={field.required}
          InputLabelProps={{
            shrink: true,
          }}
        />
      );

    case 'select':
      return (
        <FormControl {...commonProps} required={field.required}>
          <InputLabel>{field.label}</InputLabel>
          <Select
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            input={<OutlinedInput label={field.label} />}
          >
            {field.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {(error?.message || field.helperText) && (
            <FormHelperText error={!!error}>
              {error?.message || field.helperText}
            </FormHelperText>
          )}
        </FormControl>
      );

    case 'radio':
      return (
        <FormControl component="fieldset" error={!!error} required={field.required}>
          <FormLabel component="legend">{field.label}</FormLabel>
          <RadioGroup
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
          >
            {field.options?.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
                disabled={field.disabled}
              />
            ))}
          </RadioGroup>
          {(error?.message || field.helperText) && (
            <FormHelperText>
              {error?.message || field.helperText}
            </FormHelperText>
          )}
        </FormControl>
      );

    case 'checkbox':
      return (
        <FormControl component="fieldset" error={!!error}>
          <FormLabel component="legend">{field.label}</FormLabel>
          <FormGroup>
            {field.options ? (
              // 다중 체크박스
              field.options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={Array.isArray(value) && value.includes(option.value)}
                      onChange={(e) => {
                        const currentValues = Array.isArray(value) ? value : [];
                        if (e.target.checked) {
                          handleChange([...currentValues, option.value]);
                        } else {
                          handleChange(currentValues.filter((v: string) => v !== option.value));
                        }
                      }}
                      disabled={field.disabled}
                    />
                  }
                  label={option.label}
                />
              ))
            ) : (
              // 단일 체크박스
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!value}
                    onChange={(e) => handleChange(e.target.checked)}
                    disabled={field.disabled}
                  />
                }
                label={field.placeholder || '동의합니다'}
              />
            )}
          </FormGroup>
          {(error?.message || field.helperText) && (
            <FormHelperText>
              {error?.message || field.helperText}
            </FormHelperText>
          )}
        </FormControl>
      );

    default:
      return (
        <Box p={2} border="1px dashed #ccc" borderRadius={1}>
          <em>지원하지 않는 필드 타입: {field.type}</em>
        </Box>
      );
  }
};

export default FormFieldRenderer;