import {
	Box,
	Button,
	Tooltip,
	Typography,
	styled,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { format } from "date-fns";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import CustomDataGrid from "../../components/dataGrid/CustomDataGrid";
import CustomSnack from "../../components/reusable/CustomSnack";
import Header from "../../components/reusable/Header";
import UserAgreement from "../../components/reusable/UserAgreement";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useCreateNotificationMutation } from "../../redux/notifications/notificationsApi";
import { selectSocket } from "../../redux/socket/socketSlice";
import {
	useApproveTrainingMutation,
	useDeleteTrainingMutation,
	useGetTrainingsQuery,
} from "../../redux/trainings/trainingsApi";

const AdminTrainings = () => {
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(20);
	const [sort, setSort] = useState({});
	const [search, setSearch] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const [open, setOpen] = useState(false);
	const [deleteId, setDeleteId] = useState({ id: null, user: null });
	const [approveOpen, setApproveOpen] = useState(false);
	const [approvedId, setApprovedId] = useState({
		id: null,
		state: false,
		user: null,
	});
	const user = useSelector(selectCurrentUser);
	const { palette } = useTheme();
	const socketRedux = useSelector(selectSocket);
	const navigate = useNavigate();
	const isSideBarOpen = useOutletContext();
	const isNonSmallScreens = useMediaQuery("(min-width: 620px)");
	const isClose = !isNonSmallScreens && isSideBarOpen;

	const { data, isLoading } = useGetTrainingsQuery(
		{
			userId: user?.id,
			page: page + 1,
			pageSize,
			sort: JSON.stringify(sort),
			search,
			admin: true,
			limit: pageSize,
		},
		{ skip: !user?.id, refetchOnFocus: true },
	);
	const [snackInfo, setSnackInfo] = useState({
		open: false,
		message: "",
		severity: "",
	});

	const [deleteTraining] = useDeleteTrainingMutation();
	const [approveTraining] = useApproveTrainingMutation();
	const [createNotification] = useCreateNotificationMutation();

	const handleDeleteTraining = async (id) => {
		if (deleteId.id)
			try {
				await deleteTraining({ id }).unwrap();
				if (socketRedux) {
					if (deleteId?.user !== user?.id) {
						const ob = {
							receiver: deleteId?.user,
							type: "training/delete",
							sender: user?.id,
							ref: deleteId.id,
						};
						socketRedux.emit("notifApproved", {
							...ob,
							receiverId: ob.receiver,
						});
						await createNotification(ob).unwrap();
					}
				}
				setTimeout(() => {
					setSnackInfo((prev) => ({ ...prev, open: true }));
				}, 1000);
			} catch (error) {
				console.log(error);
			}
	};
	const handleApproveTraining = async (id) => {
		if (approvedId.id)
			try {
				await approveTraining({ id }).unwrap();
				if (socketRedux) {
					const ob = {
						receiver: approvedId?.user,
						type: approvedId?.state
							? "training/approve"
							: "training/disapprove",
						sender: user?.id,
						ref: approvedId.id,
					};
					socketRedux.emit("notifApproved", {
						...ob,
						receiverId: ob.receiver,
					});
					await createNotification(ob).unwrap();
				}
				setTimeout(() => {
					setSnackInfo((prev) => ({ ...prev, open: true }));
				}, 1000);
			} catch (error) {
				console.log(error);
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
			field: "title",
			headerName: "Title",
			// flex: 1,
			width: 130,
			sortable: false,
		},
		{
			field: "user",
			headerName: "Author",
			// flex: 1,
			width: 130,
			sortable: false,
			filterable: false,
			renderCell: ({
				row: {
					user: { username, _id },
				},
			}) => (
				<Tooltip title="Go to profile" arrow placement="top">
					<Typography
						fontSize={12.3}
						sx={{
							cursor: "pointer",
							"&:hover": { color: palette.secondary[300] },
						}}
						onClick={() => void navigate("/user/author", { state: _id })}>
						{username}
					</Typography>
				</Tooltip>
			),
		},
		{
			field: "createdAt",
			headerName: "CreatedAt",
			// flex: 0.7,
			width: 100,
			sortable: false,
			renderCell: ({ row: { createdAt } }) =>
				format(new Date(createdAt), "dd/MM/yyyy"),
		},
		{
			field: "tags",
			headerName: "Tags",
			// flex: 1.4,
			width: 250,
			sortable: false,
			renderCell: ({ row: { tags } }) =>
				tags.reduce((acc, cur) => (acc += `${cur} `), ``),
		},
		{
			field: "price",
			headerName: "Price",
			// flex: 0.5,
			width: 70,
			sortable: false,
			renderCell: ({ row: { price } }) => `$${price}`,
		},
		{
			field: "disp",
			headerName: "Displayed",
			// flex: 1,
			width: 140,
			sortable: false,
			renderCell: ({ row: { display } }) => (
				<Box display="flex" alignItems="center">
					{display ? (
						<Approved color={"info"}>Displayed</Approved>
					) : (
						<NotApproved color={"warning"}>Not Displayed</NotApproved>
					)}
				</Box>
			),
		},
		{
			field: "app",
			headerName: "Approved",
			// flex: 1,
			width: 120,
			sortable: false,
			renderCell: ({ row: { approved } }) => (
				<Box display="flex" alignItems="center">
					{approved ? (
						<Approved color={"success"}>Approved</Approved>
					) : (
						<NotApproved color={"error"}>Not Approved</NotApproved>
					)}
				</Box>
			),
		},
		{
			field: "action",
			headerName: "Actions",
			// flex: 2,
			width: 255,
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
							placement="top"
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
										setDeleteId({
											id: params.row.id,
											user: params.row.user._id,
										});
										setSnackInfo((prev) => ({
											...prev,
											message: `${params.row.title} training deleted`,
											severity: "error",
											open: false,
										}));
										setOpen(true);
									}}>
									Delete
								</Button>
							</Box>
						</Tooltip>
						{params.row.user._id !== user.id && (
							<Box>
								<Button
									variant="contained"
									size="small"
									sx={{
										width: 82,
										color: palette.secondary[400],
										bgcolor: !params.row.approved
											? palette.success.dark
											: palette.warning.dark,
										"&:hover": {
											bgcolor: palette.secondary[400],
											color: !params.row.approved
												? palette.success.dark
												: palette.warning.dark,
										},
									}}
									onClick={() => {
										setApprovedId({
											id: params.row.id,
											state: !params.row.approved,
											user: params.row.user._id,
										});
										setSnackInfo((prev) => ({
											...prev,
											message: `${params.row.title} training ${
												!params.row.approved ? "approved" : "disapproved"
											}`,
											severity: !params.row.approved ? "success" : "warning",
											open: false,
										}));
										setApproveOpen(true);
									}}>
									{!params.row.approved ? "Approve" : "Disapprove"}
								</Button>
							</Box>
						)}
					</Box>
				);
			},
		},
	];

	console.log({ pageSize });

	return (
		<Box m="1.5rem 2.5rem" pb={2} sx={{ overflowX: "hidden" }}>
			<CustomSnack
				open={snackInfo.open}
				setOpen={(arg) => setSnackInfo((prev) => ({ ...prev, open: arg }))}
				message={snackInfo.message}
				severity={snackInfo.severity}
			/>
			<Header title="Trainings" subtitle="See the list of trainings." />
			<UserAgreement
				open={open}
				setOpen={setOpen}
				title={"Confirm delete"}
				text={
					"Are you sure you want to delete this training? You can't undo after you press Agree, be careful what you want."
				}
				handleAgree={async () => await handleDeleteTraining(deleteId.id)}
			/>
			<UserAgreement
				open={approveOpen}
				setOpen={setApproveOpen}
				title={`Confirm ${approvedId.state ? "approve" : "disapprove"}`}
				text={`Are you sure you want to ${
					approvedId.state ? "approve" : "disapprove"
				} this training? Be sure you checked it!`}
				handleAgree={async () => await handleApproveTraining(approvedId.id)}
			/>
			<Box
				maxWidth={1700}
				display={isClose ? "none" : "flex"}
				justifyContent="center"
				overflow="hidden"
				m="0 auto">
				<Box flex={1} maxWidth={1450}>
					<CustomDataGrid
						isLoading={isLoading || !data}
						rows={data?.trainings || []}
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
const NotApproved = styled("div", {
	shouldForwardProp: (prop) => prop !== "color",
})(({ theme, color }) => ({
	color: theme.palette[color][theme.palette.mode === "dark" ? "light" : "dark"],
	backgroundColor: " rgba(253, 181, 40, 0.12)",
	padding: " 3px 5px",
	borderRadius: "3px",
	fontSize: 14,
}));
const Approved = styled("div", {
	shouldForwardProp: (prop) => prop !== "color",
})(({ theme, color }) => ({
	color: theme.palette[color][theme.palette.mode === "dark" ? "light" : "dark"],
	backgroundColor: " rgba(253, 181, 40, 0.12)",
	padding: " 3px 5px",
	borderRadius: "3px",
	fontSize: 14,
}));

export default AdminTrainings;
