import { Box, Button, Tooltip, styled, useTheme } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CustomDataGrid from "../../components/dataGrid/CustomDataGrid";
import Header from "../../components/reusable/Header";
import UserAgreement from "../../components/reusable/UserAgreement";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import {
	useApproveTrainingMutation,
	useDeleteTrainingMutation,
	useGetTrainingsQuery,
} from "../../redux/trainings/trainingsApi";
import { format } from "date-fns";

const AdminTrainings = () => {
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(20);
	const [sort, setSort] = useState({});
	const [search, setSearch] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const [open, setOpen] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const [approveOpen, setApproveOpen] = useState(false);
	const [approvedId, setApprovedId] = useState(null);
	const user = useSelector(selectCurrentUser);
	const { palette } = useTheme();

	const { data, isLoading } = useGetTrainingsQuery(
		{
			userId: user?.id,
			page,
			pageSize,
			sort: JSON.stringify(sort),
			search,
			admin: true,
		},
		{ skip: !user?.id },
	);

	const [deleteTraining] = useDeleteTrainingMutation();
	const [approveTraining] = useApproveTrainingMutation();

	const handleDeleteTraining = async (id) => {
		if (deleteId)
			try {
				await deleteTraining({ id }).unwrap();
			} catch (error) {
				console.log(error);
			}
	};
	const handleApproveTraining = async (id) => {
		if (approvedId)
			try {
				await approveTraining({ id }).unwrap();
			} catch (error) {
				console.log(error);
			}
	};
	const columns = [
		{
			field: "id",
			headerName: "ID",
			flex: 1,
			sortable: false,
		},
		{
			field: "title",
			headerName: "Title",
			flex: 1,
			sortable: false,
		},
		{
			field: "user",
			headerName: "Username",
			flex: 1,
			sortable: false,
			renderCell: ({
				row: {
					user: { username },
				},
			}) => username,
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
			field: "tags",
			headerName: "Tags",
			flex: 2,
			sortable: false,
		},
		{
			field: "app",
			headerName: "Approved",
			flex: 1,
			sortable: false,
			renderCell: ({ row: { approved } }) => (
				<Box display="flex" alignItems="center">
					{approved ? (
						<Approved>Approved</Approved>
					) : (
						<NotApproved>Not Approved</NotApproved>
					)}
				</Box>
			),
		},
		{
			field: "action",
			headerName: "Actions",
			flex: 2,
			sortable: false,
			filterable: false,
			renderCell: (params) => {
				return (
					<Box
						sx={{
							width: "100%",
							display: "flex",
							gap: 1,
							alignItems: "center",
						}}>
						<Link
							to={`/trainings/find/${params.row.id}`}
							style={{ textDecoration: "none" }}>
							<Button
								variant="contained"
								size="small"
								sx={{
									color: palette.secondary[300],
									bgcolor: palette.background.default,
									"&:hover": {
										bgcolor: palette.secondary[300],
										color: palette.background.default,
									},
								}}>
								View
							</Button>
						</Link>
						<Tooltip
							title={params.row?.occurrences > 0 ? "Bought" : ""}
							placement="right"
							arrow>
							<Box>
								<Button
									variant="contained"
									size="small"
									disabled={params.row?.occurrences > 0}
									sx={{
										color: palette.secondary[300],
										bgcolor: palette.error.dark,
										"&:hover": {
											bgcolor: palette.secondary[300],
											color: palette.error.dark,
										},
									}}
									onClick={() => {
										setDeleteId(params.row.id);
										setOpen(true);
									}}>
									Delete
								</Button>
							</Box>
						</Tooltip>
						{!params.row?.approved && (
							<Box>
								<Button
									variant="contained"
									size="small"
									sx={{
										color: palette.secondary[300],
										bgcolor: palette.success.dark,
										"&:hover": {
											bgcolor: palette.secondary[300],
											color: palette.success.dark,
										},
									}}
									onClick={() => {
										setApprovedId(params.row.id);
										setApproveOpen(true);
									}}>
									Apporve
								</Button>
							</Box>
						)}
					</Box>
				);
			},
		},
	];

	console.log({ data });

	return (
		<Box m="1.5rem 2.5rem">
			<Header title="Trainings" subtitle="See the list of trainings." />
			<UserAgreement
				open={open}
				setOpen={setOpen}
				title={"Confirm delete"}
				text={
					"Are you sure you want to delete this training? You can't undo after you press Agree, be careful what you want."
				}
				handleAgree={async () => await handleDeleteTraining(deleteId)}
			/>
			<UserAgreement
				open={approveOpen}
				setOpen={setApproveOpen}
				title={"Confirm approve"}
				text={
					"Are you sure you want to approve this training? Be sure you checked it!"
				}
				handleAgree={async () => await handleApproveTraining(approvedId)}
			/>
			<CustomDataGrid
				isLoading={isLoading || !data}
				rows={data?.trainings || []}
				columns={columns}
				rowCount={data?.count || 0}
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
const NotApproved = styled("div")(({ theme }) => ({
	color: theme.palette.error[theme.palette.mode === "dark" ? "light" : "dark"],
	backgroundColor: " rgba(253, 181, 40, 0.12)",
	padding: " 3px 5px",
	borderRadius: "3px",
	fontSize: 14,
}));
const Approved = styled("div")(({ theme }) => ({
	color:
		theme.palette.success[theme.palette.mode === "dark" ? "light" : "dark"],
	backgroundColor: " rgba(253, 181, 40, 0.12)",
	padding: " 3px 5px",
	borderRadius: "3px",
	fontSize: 14,
}));

export default AdminTrainings;
