import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/reusable/Header";
import { NftContext } from "../../context/NftContext";
import CustomDataGrid from "../../dataGrid/CustomDataGrid";
import DataGridCustomToolbar from "../../dataGrid/DataGridCustomToolbar";

const NftTransactions = () => {
	const {
		getAllTransactions,
		contracts: { transactions: t },
	} = useContext(NftContext);
	const theme = useTheme();

	const [pageSize, setPageSize] = useState(20);

	const [transactions, setTransactions] = useState([]);

	const columns = [
		{
			field: "id",
			headerName: "ID",
			flex: 1,
		},
		{
			field: "title",
			headerName: "Title",
			flex: 0.5,
		},
		{
			field: "cost",
			headerName: "Cost ETH",
			flex: 0.5,
		},
		{
			field: "metadataURI",
			headerName: "MetadataURI",
			flex: 1,
		},
		{
			field: "owner",
			headerName: "Owner",
			flex: 1,
		},
		{
			field: "timestamp",
			headerName: "Timestamp",
			flex: 0.5,
		},
	];

	useEffect(() => {
		(async () => {
			await getAllTransactions();
		})();
	}, [getAllTransactions]);
	useEffect(() => {
		setTransactions(t);
	}, [t]);

	console.log("transactions", transactions);

	return (
		<Box m="1.5rem 2.5rem">
			<Header title="NFT Transactions" subtitle="Manage nft transactions" />
			<Box
				height={"80vh"}
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
				}}>
				<DataGrid
					loading={!transactions || transactions?.length === 0}
					rows={transactions || []}
					columns={columns}
					rowCount={transactions?.length || 0}
					rowsPerPageOptions={[20, 50, 100]}
					pagination
					pageSize={pageSize}
					onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
					components={{ Toolbar: GridToolbar }}
					componentsProps={{
						toolbar: {
							showQuickFilter: true,
							quickFilterProps: { debounceMs: 500 },
						},
					}}
				/>
			</Box>
		</Box>
	);
};

export default NftTransactions;
