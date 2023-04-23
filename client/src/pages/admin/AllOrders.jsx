import { Box, Button, Typography, styled, useTheme } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomDataGrid from "../../components/dataGrid/CustomDataGrid";
import Header from "../../components/reusable/Header";
import { useGetAllOrdersQuery } from "../../redux/orders/orderApi";
import { format } from "date-fns";
import { useMediaQuery } from "@mui/material";
import { useOutletContext } from "react-router-dom";

const AllOrders = () => {
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(20);
	const [sort, setSort] = useState({});
	const [search, setSearch] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const { palette } = useTheme();
	const navigate = useNavigate();
	const { data, isLoading } = useGetAllOrdersQuery({
		page,
		pageSize,
		sort: JSON.stringify(sort),
		search,
	});
	const isNonMobileScreens = useMediaQuery("(min-width: 1200px)");
	const isSideBarOpen = useOutletContext();
	const isSmall = isNonMobileScreens && !isSideBarOpen;

	const columns = [
		{
			field: "id",
			headerName: "ID",
			// flex: 1,
			width: 220,
		},
		{
			field: "_id",
			headerName: "UserID",
			// flex: 1,
			width: 220,
			renderCell: ({
				row: {
					user: { _id },
				},
			}) => <p key={_id}>{_id}</p>,
		},
		{
			field: "username",
			headerName: "Username",
			// flex: 1,
			width: 200,
			sortable: false,
			filterable: false,
			renderCell: ({
				row: {
					user: { username, _id },
				},
			}) => (
				<Typography
					fontSize={12.3}
					sx={{
						cursor: "pointer",
						"&:hover": { color: palette.secondary[300] },
					}}
					onClick={() => void navigate("/user/author", { state: _id })}>
					{username}
				</Typography>
			),
		},
		{
			field: "createdAt",
			headerName: "CreatedAt",
			// flex: 0.7,
			sortable: false,
			width: 150,
			renderCell: ({ row: { createdAt } }) =>
				format(new Date(createdAt), "dd/MM/yyyy"),
		},
		{
			field: "deliveryStatus",
			headerName: "DeliveryStatus",
			// flex: 0.5,
			width: 110,
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
			field: "paymentStatus",
			headerName: "PaymentStatus",
			// flex: 0.4,
			width: 110,
			// sortable: false,
			renderCell: ({ row: { paymentStatus } }) => <Paid>{paymentStatus}</Paid>,
		},
		{
			field: "total",
			headerName: "Total",
			// flex: 0.5,
			width: 110,
			sortable: false,
			renderCell: ({ row: { total } }) => `$${total / 100}`,
		},
		{
			field: "phone",
			headerName: "Phone",
			// flex: 0.5,
			width: 130,
			renderCell: ({
				row: {
					shipping: { phone },
				},
			}) => phone,
		},
		{
			field: "actions",
			headerName: "Actions",
			// flex: 1,
			width: 110,
			sortable: false,
			filterable: false,
			renderCell: ({ row: { id } }) => (
				<Box display="flex" alignItems="center" gap={1}>
					<Button
						variant="outlined"
						size="small"
						disableElevation
						// className="btn"
						sx={{
							color: palette.secondary[200],
							bgcolor: palette.background.alt,
						}}
						onClick={() => void navigate(`/orders/${id}`)}>
						View
					</Button>
				</Box>
			),
		},
	];

	return (
		<Box m="1.5rem 2.5rem" pb={2} sx={{ overflowX: "hidden" }}>
			<Header title="Orders" subtitle="Manage orders" />
			<Box
				maxWidth={1700}
				display="flex"
				justifyContent="center"
				overflow="hidden"
				m="0 auto">
				<Box flex={isSmall ? 0.95 : 1} maxWidth={1400}>
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

export default AllOrders;
