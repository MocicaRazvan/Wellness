import { Box } from "@mui/material";
import React, { useState } from "react";
import Header from "../../components/reusable/Header";
import CustomDataGrid from "../../dataGrid/CustomDataGrid";
import {
	useGetAllOrdersQuery,
} from "../../redux/orders/orderApi";

const AllOrders = () => {
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(20);
	const [sort, setSort] = useState({});
	const [search, setSearch] = useState("");
	const [searchInput, setSearchInput] = useState("");
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
			flex: 1,
		},
		{
			field: "deliveryStatus",
			headerName: "DeliveryStatus",
			flex: 0.5,
		},
		{
			field: "paymentStatus",
			headerName: "PaymentStatus",
			flex: 0.4,
		},
		{
			field: "total",
			headerName: "Total",
			flex: 1,
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

export default AllOrders;
