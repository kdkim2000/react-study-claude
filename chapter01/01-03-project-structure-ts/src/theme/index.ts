import { createTheme } from '@mui/material/styles';
import { palette } from './palette';
import { overrides } from './overrides';

// 프로젝트 전체에서 사용할 테마 생성
export const theme = createTheme({
  palette,
  components: overrides,
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
  },
});