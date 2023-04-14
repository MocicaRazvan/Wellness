import { Button, CircularProgress, Typography, useTheme } from "@mui/material";
import { Box, styled } from "@mui/system";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomDataGrid from "../../components/dataGrid/CustomDataGrid";
import Header from "../../components/reusable/Header";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import {
	useChangeOrderStatusMutation,
	useGetAllOrdersQuery,
} from "../../redux/orders/orderApi";
import { format } from "date-fns";

const Orders = () => {
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(20);
	const [sort, setSort] = useState({});
	const [search, setSearch] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const user = useSelector(selectCurrentUser);
	const theme = useTheme();
	const navigate = useNavigate();
	const { data, isLoading } = useGetAllOrdersQuery(
		{
			userId: user?.id,
			page,
			pageSize,
			sort: JSON.stringify(sort),
			search,
		},
		{ skip: !user?.id },
	);

	const [changeOrderStatus] = useChangeOrderStatusMutation();

	const handleOrderStatusChange = async (credentials) => {
		try {
			await changeOrderStatus(credentials).unwrap();
		} catch (error) {
			console.log(error);
		}
	};

	if (!user?.id)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);

	const columns = [
		{
			field: "id",
			headerName: "ID",
			flex: 1,
			sortable: false,
		},
		{
			field: "createdAt",
			headerName: "CreatedAt",
			flex: 0.7,
			sortable: false,
			renderCell: ({ row: { createdAt } }) =>
				format(new Date(createdAt), "dd/MM/yyyy"),
		},
		{
			field: "paymentStatus",
			headerName: "Payment Status",
			flex: 1,
			renderCell: ({ row: { paymentStatus } }) => (
				<Typography variant="h6" color={theme.palette.secondary[300]}>
					{paymentStatus}
				</Typography>
			),
		},
		{
			field: "subTotal",
			headerName: "Sub Total",
			flex: 1,
			renderCell: ({ row: { subTotal } }) => `$${subTotal / 100}`,
		},
		{
			field: "deliveryStatus",
			headerName: "Delivery Status",
			flex: 0.5,
			sortable: false,
			renderCell: ({ row: { deliveryStatus: dS } }) => (
				<div>
					{dS === "pending" ? (
						<Pending>Pending</Pending>
					) : dS === "dispatched" ? (
						<Dispatched>Dispatched</Dispatched>
					) : dS === "delivered" ? (
						<Delivered>Delivered</Delivered>
					) : (
						<>error</>
					)}
				</div>
			),
		},
		{
			field: "actions",
			headerName: "Actions",
			flex: 1,
			sortable: false,
			filterable: false,
			renderCell: ({ row: { id, deliveryStatus: dS } }) => (
				<Box display="flex" alignItems="center" gap={1}>
					<Button
						variant="outlined"
						size="small"
						disableElevation
						// className="btn"
						sx={{
							color: theme.palette.secondary[200],
							bgcolor: theme.palette.background.alt,
						}}
						onClick={() => void navigate(`/orders/${id}`)}>
						View
					</Button>
					{dS !== "delivered" && (
						<Button
							variant="contained"
							size="small"
							disableElevation
							color="success"
							onClick={async () =>
								await handleOrderStatusChange({
									id,
									deliveryStatus: "delivered",
								})
							}>
							Confirm Receiving
						</Button>
					)}
				</Box>
			),
		},
	];

	console.log({ search });

	return (
		<Box m="1.5rem 2.5rem">
			<Header title="Your Orders" subtitle="Manage your orders" />
			<CustomDataGrid
				isLoading={isLoading || !data}
				rows={data?.orders || []}
				columns={columns}
				rowCount={data?.total || 0}
				page={page}
				setPage={setPage}
				setPageSize={setPageSize}
				setSort={setSort}
				pageSize={pageSize}
				toolbar={{ searchInput, setSearchInput, setSearch }}
			/>
		</Box>
	);
};
const Pending = styled("div")(({ theme }) => ({
	color: " rgb(253, 181, 40)",
	backgroundColor: " rgba(253, 181, 40, 0.12)",
	padding: " 3px 5px",
	borderRadius: "3px",
	fontSize: 14,
}));
const Dispatched = styled("div")(({ theme }) => ({
	color: " rgb(38, 198, 249)",
	backgroundColor: " rgba(253, 181, 40, 0.12)",
	padding: " 3px 5px",
	borderRadius: "3px",
	fontSize: 14,
}));

const Delivered = styled("div")(({ theme }) => ({
	color: theme.palette.success.dark,
	backgroundColor: " rgba(253, 181, 40, 0.12)",
	opacity: "0.9",
	padding: " 3px 5px",
	borderRadius: "3px",
	fontSize: 14,
}));

export default Orders;
