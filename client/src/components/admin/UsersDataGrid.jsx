import { Box, Button, styled, Tooltip, useTheme } from "@mui/material";
import React, { useState } from "react";
import {
	useGetAllUsersAdminQuery,
	useMakeUserTrainerMutationMutation,
} from "../../redux/user/userApi";
import CustomDataGrid from "../dataGrid/CustomDataGrid";
import UserAgreement from "../reusable/UserAgreement";
import { useCreateSupportConversationMutation } from "../../redux/conversation/conversationApi";
import { useNavigate } from "react-router-dom";

const UsersDataGrid = ({ height = "80vh" }) => {
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(20);
	const [sort, setSort] = useState({});
	const [search, setSearch] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const [createConv] = useCreateSupportConversationMutation();
	const { palette } = useTheme();
	const navigate = useNavigate();

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
			// flex: 1,
			width: 220,
			sortable: false,
		},
		{
			field: "username",
			headerName: "Username",
			// flex: 0.5,
			width: 110,
		},
		{
			field: "email",
			headerName: "Email",
			// flex: 0.9,
			width: 220,
		},
		{
			field: "phoneNumber",
			headerName: "Phone Number",
			// flex: 0.5,
			width: 110,
		},
		{
			field: "location",
			headerName: "Location",
			// flex: 0.4,
			width: 110,
		},
		{
			field: "occupation",
			headerName: "Occupation",
			// flex: 0.5,
			width: 110,
		},
		{
			field: "role",
			headerName: "Role",
			// flex: 0.6,
			width: 130,
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
		{
			field: "contact",
			headerName: "Contact",
			// flex: 0.6,
			width: 140,
			sortable: false,
			filterable: false,
			renderCell: ({ row: { role, id } }) =>
				role !== "admin" && (
					<Button
						size="small"
						onClick={async () => {
							try {
								const res = await createConv({ id }).unwrap();
								navigate(`/messenger/?conv=${res?.savedConversation?._id}`, {
									state: true,
								});
							} catch (error) {
								console.log(error);
							}
						}}
						sx={{
							bgcolor: palette.background.default,
							color: palette.secondary[400],
							"&:hover": {
								color: palette.background.default,
								bgcolor: palette.secondary[400],
							},
						}}>
						Contact
					</Button>
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
