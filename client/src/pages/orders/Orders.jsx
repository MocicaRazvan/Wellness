import {
	Button,
	CircularProgress,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
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
	const isNonMobileScreens = useMediaQuery("(min-width: 1200px)");
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
			// flex: 1,
			width: 240,
			sortable: false,
		},
		{
			field: "createdAt",
			headerName: "CreatedAt",
			// flex: 0.7,
			width: 170,
			sortable: false,
			renderCell: ({ row: { createdAt } }) =>
				format(new Date(createdAt), "dd/MM/yyyy"),
		},
		{
			field: "paymentStatus",
			headerName: "Payment Status",
			// flex: 1,
			width: 170,
			// sortable: false,
			renderCell: ({ row: { paymentStatus } }) => <Paid>{paymentStatus}</Paid>,
		},
		{
			field: "subTotal",
			headerName: "Sub Total",
			// flex: 1,
			width: 170,
			sortable: false,
			renderCell: ({ row: { subTotal } }) => `$${subTotal / 100}`,
		},
		{
			field: "trainings",
			headerName: "Trainings",
			// flex: 1,
			width: 90,
			sortable: false,
			filterable: false,
			renderCell: ({ row: { trainings } }) => trainings.length,
		},
		{
			field: "deliveryStatus",
			headerName: "Delivery Status",
			// flex: 0.5,
			width: 200,
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
			// flex: 1,
			width: 220,
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
							color: theme.palette.secondary[300],
							bgcolor: theme.palette.background.default,

							"&:hover": {
								bgcolor: theme.palette.secondary[300],
								color: theme.palette.background.default,
							},
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
							sx={{
								color: theme.palette.secondary[300],
								bgcolor: theme.palette.success.dark,
								"&:hover": {
									bgcolor: theme.palette.secondary[300],
									color: theme.palette.success.dark,
								},
							}}
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

	return (
		<Box m="1.5rem 2.5rem">
			<Header title="Your Orders" subtitle="Manage your orders" />
			<Box
				maxWidth={1700}
				display="flex"
				justifyContent="center"
				overflow="hidden"
				m="0 auto">
				<Box flex={isNonMobileScreens ? 0.9 : 1} maxWidth={1270}>
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
			</Box>
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
	color:
		theme.palette.success[theme.palette.mode === "dark" ? "light" : "dark"],
	backgroundColor: " rgba(253, 181, 40, 0.12)",
	opacity: "0.9",
	padding: " 3px 5px",
	borderRadius: "3px",
	fontSize: 14,
}));
const Paid = styled("div")(({ theme }) => ({
	color: theme.palette.info[theme.palette.mode === "dark" ? "light" : "dark"],
	backgroundColor: " rgba(253, 181, 40, 0.12)",
	opacity: "0.9",
	padding: " 3px 5px",
	borderRadius: "3px",
	fontSize: 14,
}));

export default Orders;
