import { useState } from 'react';
import { Typography, Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useApi } from '../../hooks/useApi';
import { useDialog } from '../../hooks/useDialog';
import { useSnackbar } from '../../hooks/useSnackbar';
import DataTable from '../../components/ui/DataTable';
import CustomButton from '../../components/ui/CustomButton';
import CustomDialog from '../../components/ui/CustomDialog';
import Loading from '../../components/common/Loading';

interface BoardItem {
  id: number;
  title: string;
  author: string;
  date: string;
}

const BoardList = () => {
  const [selectedItem, setSelectedItem] = useState<BoardItem | null>(null);
  const { data, loading, error, refetch } = useApi<BoardItem[]>('/api/board');
  const { open, openDialog, closeDialog } = useDialog();
  const { showSuccess, showInfo } = useSnackbar();

  if (loading) return <Loading message="게시글 목록을 불러오는 중..." />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return null;

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      type: 'number',
    },
    {
      field: 'title',
      headerName: '제목',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'author',
      headerName: '작성자',
      width: 120,
    },
    {
      field: 'date',
      headerName: '작성일',
      width: 120,
      type: 'date',
      valueGetter: (params) => new Date(params),
    },
    {
      field: 'actions',
      headerName: '작업',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <CustomButton
          size="small"
          variant="outlined"
          onClick={() => {
            setSelectedItem(params.row as BoardItem);
            openDialog();
          }}
        >
          보기
        </CustomButton>
      ),
    },
  ];

  const handleRefresh = () => {
    refetch();
    showInfo('목록을 새로고침했습니다.');
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h3" gutterBottom>
            게시판
          </Typography>
          <Typography variant="body1" color="text.secondary">
            게시글 목록을 관리하고 확인하세요
          </Typography>
        </Box>
        
        <CustomButton
          variant="contained"
          onClick={handleRefresh}
        >
          새로고침
        </CustomButton>
      </Box>

      <DataTable
        rows={data}
        columns={columns}
        loading={loading}
        height={500}
      />

      <CustomDialog
        open={open}
        onClose={closeDialog}
        title="게시글 상세"
        onConfirm={() => {
          showSuccess('확인했습니다.');
          closeDialog();
        }}
        confirmText="확인"
      >
        {selectedItem && (
          <Box>
            <Typography variant="h6" gutterBottom>
              {selectedItem.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              작성자: {selectedItem.author} | 작성일: {selectedItem.date}
            </Typography>
            <Typography variant="body1" mt={2}>
              이것은 게시글 내용입니다. 실제 프로젝트에서는 여기에 
              게시글의 전체 내용이 표시됩니다.
            </Typography>
          </Box>
        )}
      </CustomDialog>
    </Box>
  );
};

export default BoardList;