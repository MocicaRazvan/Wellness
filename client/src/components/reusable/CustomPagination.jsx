import { TablePagination } from "@mui/material";
import { useState } from "react";
const CustomPagination = ({
	page,
	rowsPerPage,
	setPage,
	setRowsPerPage,
	count,
}) => {
	const handleChangePage = (event, newPage) => {
		console.log(newPage);
		setPage(newPage + 1);
	};

	const handleChangeRowsPerPage = (event) => {
		console.log(event.target.value);
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<TablePagination
			component="div"
			count={count * rowsPerPage}
			page={page - 1}
			onPageChange={handleChangePage}
			rowsPerPage={rowsPerPage}
			rowsPerPageOptions={[12, 24, 36]}
			onRowsPerPageChange={handleChangeRowsPerPage}
		/>
	);
	// return (
	// 	<TablePagination
	// 		component="div"
	// 		count={100}
	// 		page={page}
	// 		onPageChange={handleChangePage}
	// 		rowsPerPage={rowsPerPage}
	// 		onRowsPerPageChange={handleChangeRowsPerPage}
	// 	/>
	// );
};

export default CustomPagination;
