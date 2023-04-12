import { Box, Button, styled, useTheme } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomDataGrid from "../../components/dataGrid/CustomDataGrid";
import Header from "../../components/reusable/Header";
import { useGetAllOrdersQuery } from "../../redux/orders/orderApi";
import { format } from "date-fns";

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

	const columns = [
		{
			field: "id",
			headerName: "ID",
			flex: 1,
		},
		{
			field: "_id",
			headerName: "User id",
			flex: 1,
			renderCell: ({
				row: {
					user: { _id },
				},
			}) => <p key={_id}>{_id}</p>,
		},
		{
			field: "createdAt",
			headerName: "CreatedAt",
			flex: 0.7,
			renderCell: ({ row: { createdAt } }) =>
				format(new Date(createdAt), "dd/MM/yyyy"),
		},
		{
			field: "deliveryStatus",
			headerName: "DeliveryStatus",
			flex: 0.5,
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
			flex: 0.4,
		},
		{
			field: "total",
			headerName: "Total",
			flex: 0.5,
			renderCell: ({ row: { total } }) => `$${total}`,
		},
		{
			field: "phone",
			headerName: "Phone",
			flex: 0.5,
			renderCell: ({
				row: {
					shipping: { phone },
				},
			}) => phone,
		},
		{
			field: "actions",
			headerName: "Actions",
			flex: 1,
			renderCell: ({ row: { id, deliveryStatus: dS } }) => (
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
		<Box m="1.5rem 2.5rem">
			<Header title="Orders" subtitle="Manage orders" />
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

export default AllOrders;
