import {
	Button,
	Tooltip,
	styled,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CustomDataGrid from "../../components/dataGrid/CustomDataGrid";
import CustomSnack from "../../components/reusable/CustomSnack";
import Header from "../../components/reusable/Header";
import LootieCustom from "../../components/reusable/LootieCustom";
import UserAgreement from "../../components/reusable/UserAgreement";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import {
	useDeleteTrainingMutation,
	useDisplayTrainingMutation,
	useGetUserTrainingsQuery,
} from "../../redux/trainings/trainingsApi";
import cantSee from "../../utils/lottie/cantSee.json";

const Trainings = () => {
	const { state, pathname } = useLocation();
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(20);
	const [sort, setSort] = useState({});
	const [search, setSearch] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const [open, setOpen] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const [displayOpen, setDisplayOpen] = useState(false);
	const [displayId, setDisplayId] = useState({ id: null, state: false });
	const user = useSelector(selectCurrentUser);
	const isNonMobileScreens = useMediaQuery("(min-width: 1200px)");
	const [snackInfo, setSnackInfo] = useState({
		title: "",
		open: false,
		severity: "",
	});
	const [snackOpen, setSnackOpen] = useState({
		message: "",
		open: false,
		severity: "",
	});
	const { palette } = useTheme();
	const navigate = useNavigate();

	const { data, isLoading } = useGetUserTrainingsQuery(
		{
			userId: user?.id,
			page,
			pageSize,
			sort: JSON.stringify(sort),
			search,
		},
		{
			skip: !user?.id,
			refetchOnFocus: true,
			refetchOnMountOrArgChange: true,
			refetchOnReconnect: true,
		},
	);
	const [deleteTraining] = useDeleteTrainingMutation();
	const [displayTraining] = useDisplayTrainingMutation();
	const handleDeleteTraining = async (id) => {
		try {
			await deleteTraining({ id }).unwrap();
			setTimeout(() => {
				setSnackInfo((prev) => ({ ...prev, open: true }));
			}, 1000);
		} catch (error) {
			console.log(error);
		}
	};
	const handleDisplay = async (id) => {
		try {
			if (displayId.id) await displayTraining({ id }).unwrap();
			setTimeout(() => {
				setSnackInfo((prev) => ({ ...prev, open: true }));
			}, 1000);
		} catch (error) {
			console.log(error);
		}
	};
	const columns = [
		{
			field: "title",
			headerName: "Title",
			// flex: 1,
			width: 150,
			sortable: false,
		},

		{
			field: "exercises",
			headerName: "Exercises",
			// flex: 1,
			width: 80,
			sortable: false,
			filterable: false,
			renderCell: ({ row: { exercises } }) => exercises.length,
		},
		{
			field: "occurrences",
			headerName: "Times Bought",
			width: 100,
		},
		{
			field: "createdAt",
			headerName: "CreatedAt",
			// flex: 0.7,
			width: 140,
			sortable: false,
			renderCell: ({ row: { createdAt } }) =>
				format(new Date(createdAt), "dd/MM/yyyy"),
		},
		{
			field: "updatedAt",
			headerName: "UpdatedAt",
			// flex: 0.7,
			width: 140,
			sortable: false,
			renderCell: ({ row: { updatedAt } }) =>
				format(new Date(updatedAt), "dd/MM/yyyy"),
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
			width: 100,
			renderCell: ({ row: { price } }) => `$${price}`,
		},
		{
			field: "disp",
			headerName: "Displayed",
			// flex: 1,
			width: 150,
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
			width: 150,
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
			width: 300,
			sortable: false,
			filterable: false,
			renderCell: (params) => {
				return (
					<Box sx={{ width: "100%", display: "flex", gap: 1 }}>
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
									sx={{
										color: palette.secondary[300],
										bgcolor: palette.error.dark,
										"&:hover": {
											bgcolor: palette.secondary[300],
											color: palette.error.dark,
										},
									}}
									disabled={params.row?.occurrences > 0}
									onClick={() => {
										setDeleteId(params.row.id);
										setSnackInfo({
											open: false,
											title: params.row.title,
											severity: "error",
										});
										setOpen(true);
									}}>
									Delete
								</Button>
							</Box>
						</Tooltip>

						<Tooltip
							title={!params.row.approved ? "Not Approved" : ""}
							placement="top"
							arrow>
							<Box>
								<Button
									variant="contained"
									size="small"
									sx={{
										color: palette.secondary[300],
										bgcolor: palette.warning.dark,
										"&:hover": {
											bgcolor: palette.secondary[300],
											color: palette.warning.dark,
										},
									}}
									disabled={!params.row.approved}
									onClick={() => {
										setDisplayId({
											id: params.row.id,
											state: !params.row.display,
										});
										setSnackInfo({
											open: false,
											title: params.row.title,
											severity: params.row.display ? "warning" : "success",
										});
										setDisplayOpen(true);
									}}>
									{params.row.display ? "hide" : "show"}
								</Button>
							</Box>
						</Tooltip>

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
							onClick={() =>
								void navigate(`/trainings/user/edit/${params.row.id}`)
							}>
							Update
						</Button>
					</Box>
				);
			},
		},
	];
	useEffect(() => {
		if (state?.open) {
			setSnackOpen({
				open: state?.open,
				message: state?.message,
				severity: state?.severity,
			});
			navigate("/trainings/user", { replace: true });
		}
	}, [navigate, state?.message, state?.open, state?.severity]);

	if (user?.role === "user") {
		navigate("/");
	}

	if (data && !data?.exists) {
		return (
			<LootieCustom
				lootie={cantSee}
				link={"/trainings/create"}
				btnText="Start Creating"
				replace={false}
				title="No trainings were found :("
			/>
		);
	}

	return (
		<Box m="1.5rem 2.5rem">
			<CustomSnack
				open={snackOpen.open}
				setOpen={(arg) => setSnackOpen((prev) => ({ ...prev, open: arg }))}
				message={snackOpen.message}
				severity={snackOpen.severity}
				pathname={pathname}
			/>
			<CustomSnack
				open={snackInfo.open}
				setOpen={(arg) => setSnackInfo((prev) => ({ ...prev, open: arg }))}
				message={`${snackInfo.title} training ${
					snackInfo.severity === "error"
						? "deleted"
						: snackInfo.severity === "success"
						? "showing"
						: "hiding"
				}`}
				severity={snackInfo.severity}
			/>
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
				open={displayOpen}
				setOpen={setDisplayOpen}
				title={`Confirm ${!displayId.state ? "hiding" : "showing"}`}
				text={`Are you sure you want to ${
					!displayId.state ? "hide" : "show"
				} this training? `}
				handleAgree={async () => await handleDisplay(displayId.id)}
			/>
			<Header title="Your Trainings" subtitle="Manage your trainings" />
			<Box
				maxWidth={1700}
				display="flex"
				justifyContent="center"
				overflow="hidden"
				m="0 auto">
				<Box flex={isNonMobileScreens ? 0.95 : 1} maxWidth={1580}>
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

export default Trainings;
