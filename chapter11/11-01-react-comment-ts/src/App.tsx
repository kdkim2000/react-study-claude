import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import PostDetail from './components/PostDetail'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
})

// 샘플 게시글 데이터
const samplePost = {
  id: '1',
  title: 'React 게시판 시스템 구축하기',
  content: 'React와 TypeScript를 사용하여 게시판 시스템을 구축하는 방법에 대해 알아보겠습니다.',
  author: '개발자',
  createdAt: new Date('2024-01-15')
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          게시판 시스템
        </Typography>
        <PostDetail post={samplePost} />
      </Container>
    </ThemeProvider>
  )
}

export default App