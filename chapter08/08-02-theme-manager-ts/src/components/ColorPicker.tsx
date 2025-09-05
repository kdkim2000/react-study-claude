import React from 'react';
import { Box, Button } from '@mui/material';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

// 미리 정의된 색상 팔레트
const colorPalette = [
  '#1976d2', '#1565c0', '#0d47a1', // Blue
  '#d32f2f', '#c62828', '#b71c1c', // Red
  '#388e3c', '#2e7d32', '#1b5e20', // Green
  '#f57c00', '#ef6c00', '#e65100', // Orange
  '#7b1fa2', '#6a1b9a', '#4a148c', // Purple
  '#00796b', '#00695c', '#004d40', // Teal
];

const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
        {colorPalette.map((paletteColor) => (
          <Button
            key={paletteColor}
            onClick={() => onChange(paletteColor)}
            sx={{
              minWidth: 32,
              width: 32,
              height: 32,
              bgcolor: paletteColor,
              border: color === paletteColor ? '3px solid #000' : '1px solid #ccc',
              '&:hover': {
                bgcolor: paletteColor,
                opacity: 0.8,
              },
            }}
          />
        ))}
      </Box>
      
      {/* 커스텀 색상 입력 */}
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          height: 40,
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      />
    </Box>
  );
};

export default ColorPicker;