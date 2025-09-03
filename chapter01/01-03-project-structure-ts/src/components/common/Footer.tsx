import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.100',
        py: 2,
        mt: 'auto',
      }}
    >
      <Container>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          © 2024 React 실무 프로젝트 구조 예제. 초보자를 위한 학습용 프로젝트입니다.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;