import React, { useState } from "react";
import CustomDataGrid from "../../dataGrid/CustomDataGrid";
import { useGetAllUsersAdminQuery } from "../../redux/user/userApi";

const UsersDataGrid = ({ height = "80vh" }) => {
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(20);
	const [sort, setSort] = useState({});
	const [search, setSearch] = useState("");
	const [searchInput, setSearchInput] = useState("");

	const { data, isLoading } = useGetAllUsersAdminQuery({
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
			field: "username",
			headerName: "Username",
			flex: 0.5,
		},
		{
			field: "email",
			headerName: "Email",
			flex: 1,
		},
		{
			field: "phoneNumber",
			headerName: "Phone Number",
			flex: 0.5,
		},
		{
			field: "location",
			headerName: "Location",
			flex: 0.4,
		},
		{
			field: "occupation",
			headerName: "Occupation",
			flex: 1,
		},
		{
			field: "role",
			headerName: "Role",
			flex: 0.5,
		},
	];

	return (
		<CustomDataGrid
			isLoading={isLoading || !data}
			rows={data?.users || []}
			columns={columns}
			rowCount={data?.total || 0}
			page={page}
			setPage={setPage}
			setPageSize={setPageSize}
			setSort={setSort}
			pageSize={pageSize}
			toolbar={{ searchInput, setSearchInput, setSearch }}
			height={height}
		/>
	);
};

export default UsersDataGrid;
