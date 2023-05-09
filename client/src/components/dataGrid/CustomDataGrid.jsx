import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DataGridCustomToolbar from "./DataGridCustomToolbar";

const CustomDataGrid = ({
	isLoading,
	rows,
	columns,
	rowCount,
	page,
	pageSize,
	toolbar,
	setPage,
	setPageSize,
	setSort,
	height = "80vh",
	setSelectedId = () => {},
	disableSelectionOnClick = true,
}) => {
	const theme = useTheme();
	return (
		<Box
			height={height}
			sx={{
				"& .MuiDataGrid-root": {
					border: "none",
				},
				"& .MuiDataGrid-cell": {
					borderBottom: "none",
				},
				"& .MuiDataGrid-columnHeaders": {
					bgcolor: theme.palette.background.alt,
					color: theme.palette.secondary[100],
					borderBottom: "none",
				},
				"& .MuiDataGrid-virtualScroller": {
					bgcolor: theme.palette.primary.main,
				},
				"& .MuiDataGrid-footerContainer": {
					bgcolor: theme.palette.background.alt,
					color: theme.palette.secondary[100],
					borderTop: "none",
				},
				"& .MuiDataGrid-toolbarContainer .MuiButton-text": {
					color: `${theme.palette.secondary[200]} !important`,
				},
				"& .cellBtn": {
					color: theme.palette.secondary[200],
					bgcolor: theme.palette.background.default,
				},
				"& .MuiDataGrid-cellContent,.MuiDataGrid-cell": {
					color: theme.palette.secondary[200],
				},
				"& .MuiDataGrid-columnHeaderTitle": {
					color: theme.palette.secondary[400],
				},
			}}>
			<DataGrid
				loading={isLoading}
				getRowId={(row) => row._id}
				rows={rows}
				columns={columns}
				rowCount={rowCount}
				rowsPerPageOptions={[20, 50, 100]}
				pagination
				page={page}
				pageSize={pageSize}
				paginationMode="server"
				sortingMode="server"
				onPageChange={(newpage) => setPage(newpage)}
				onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
				onSortModelChange={(newSortModel) => setSort(...newSortModel)}
				components={{ Toolbar: DataGridCustomToolbar }}
				componentsProps={{
					toolbar,
				}}
				onSelectionModelChange={(newSelectionArray) => {
					console.log({ row: newSelectionArray[0] });
					setSelectedId(newSelectionArray[0]);
				}}
				disableSelectionOnClick={disableSelectionOnClick}
			/>
		</Box>
	);
};

export default CustomDataGrid;
