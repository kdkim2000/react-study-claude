import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { Box, Paper } from '@mui/material';

interface DataTableProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  loading?: boolean;
  height?: number;
}

const DataTable = ({ 
  rows, 
  columns, 
  loading = false,
}: DataTableProps) => {
  return (
    <Paper elevation={1}>
      <Box >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          disableRowSelectionOnClick
        />
      </Box>
    </Paper>
  );
};

export default DataTable;