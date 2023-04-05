import { Box, styled, Tooltip } from "@mui/material";
import React, { useState } from "react";
import CustomDataGrid from "../../dataGrid/CustomDataGrid";
import {
	useGetAllUsersAdminQuery,
	useMakeUserTrainerMutationMutation,
} from "../../redux/user/userApi";
import UserAgreement from "../reusable/UserAgreement";

const UsersDataGrid = ({ height = "80vh" }) => {
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(20);
	const [sort, setSort] = useState({});
	const [search, setSearch] = useState("");
	const [searchInput, setSearchInput] = useState("");

	const [makeTrainer] = useMakeUserTrainerMutationMutation();

	const { data, isLoading } = useGetAllUsersAdminQuery({
		page,
		pageSize,
		sort: JSON.stringify(sort),
		search,
	});

	const [open, setOpen] = useState(false);
	const [trainerId, settrainerId] = useState(null);

	const handleMakeTrainer = async (id) => {
		if (trainerId) {
			try {
				await makeTrainer({ id }).unwrap();
			} catch (error) {
				console.log(error);
			}
		}
	};

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
			flex: 0.7,
		},
		{
			field: "role",
			headerName: "Role",
			flex: 1,
			renderCell: ({ row: { role, id } }) => (
				<Box>
					{role === "user" ? (
						<Tooltip title="Make Trainer" arrow placement="right">
							<User
								onClick={() => {
									settrainerId(id);
									setOpen((prev) => !prev);
								}}>
								{role}
							</User>
						</Tooltip>
					) : role === "trainer" ? (
						<Trainer>{role}</Trainer>
					) : (
						<Admin>{role}</Admin>
					)}
				</Box>
			),
		},
	];

	return (
		<>
			<UserAgreement
				open={open}
				setOpen={setOpen}
				title={"Confirm update"}
				text={
					"Are you sure you want to make this person a trainer? You can't undo after you press Agree, be careful what you want."
				}
				handleAgree={async () => await handleMakeTrainer(trainerId)}
			/>
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
		</>
	);
};

const User = styled("div")(({ theme }) => ({
	color: theme.palette.error.dark,
	// backgroundColor: " rgba(253, 181, 40, 0.12)",
	padding: " 3px 5px",
	borderRadius: "3px",
	cursor: "pointer",
	fontWeight: 600,
	fontSize: 16,
}));
const Trainer = styled("div")(({ theme }) => ({
	color: theme.palette.success.dark,
	// backgroundColor: " rgba(253, 181, 40, 0.12)",
	opacity: "0.9",
	padding: " 3px 5px",
	borderRadius: "3px",
	fontWeight: 600,
	fontSize: 16,
}));

const Admin = styled("div")(({ theme }) => ({
	color: theme.palette.warning.dark,
	// backgroundColor: " rgba(253, 181, 40, 0.12)",
	padding: " 3px 5px",
	borderRadius: "3px",
	fontWeight: 600,
	fontSize: 16,
}));

export default UsersDataGrid;
