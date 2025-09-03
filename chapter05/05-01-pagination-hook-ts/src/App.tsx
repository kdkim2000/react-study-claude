import { Container, Typography, Box, Paper, Pagination } from '@mui/material';
import { usePagination } from './hooks/usePagination';

// 예시 데이터
const generateSampleData = (totalItems: number) => {
  return Array.from({ length: totalItems }, (_, index) => ({
    id: index + 1,
    title: `아이템 ${index + 1}`,
    description: `이것은 ${index + 1}번째 아이템입니다.`,
  }));
};

const ITEMS_PER_PAGE = 5;
const TOTAL_ITEMS = 50;

function App() {
  const totalPages = Math.ceil(TOTAL_ITEMS / ITEMS_PER_PAGE);
  
  const {
    currentPage,
    totalPages: pages,
    hasNextPage,
    hasPreviousPage,
    goToPage,
  } = usePagination({
    totalPages,
    initialPage: 1,
  });

  const sampleData = generateSampleData(TOTAL_ITEMS);
  
  // 현재 페이지에 표시할 아이템들
  const currentItems = sampleData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    goToPage(page);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        페이지네이션 Hook 실습
      </Typography>
      
      <Typography variant="h6" gutterBottom color="text.secondary" align="center">
        총 {TOTAL_ITEMS}개 아이템 | 페이지당 {ITEMS_PER_PAGE}개
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" gutterBottom>
          현재 페이지: {currentPage} / {pages}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          이전 페이지 있음: {hasPreviousPage ? '예' : '아니오'} | 
          다음 페이지 있음: {hasNextPage ? '예' : '아니오'}
        </Typography>
      </Box>

      {/* 아이템 목록 */}
      <Box sx={{ mb: 4 }}>
        {currentItems.map((item) => (
          <Paper 
            key={item.id} 
            elevation={1} 
            sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}
          >
            <Typography variant="h6" gutterBottom>
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.description}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Material-UI Pagination 컴포넌트 */}
      <Box display="flex" justifyContent="center">
        <Pagination
          count={pages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
        />
      </Box>
    </Container>
  );
}

export default App;